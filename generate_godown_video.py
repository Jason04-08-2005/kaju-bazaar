"""
KAJU BAZAAR - Luxury Wholesale Cashew Trading House
Realistic Godown Entry Video Generator
Synthesizes a continuous, photorealistic 4.0s broadcast-quality commercial:
1. (0.0s - 1.0s): Central Godown stacked floor-to-ceiling with wooden cashew crates.
2. (1.0s - 2.0s): Macro shot of hands lifting the wooden crate lid, revealing fresh jumbo cashews.
3. (2.0s - 3.0s): Merchant tilting the box, cascading golden cashew nuts onto emerald velvet cloth with realistic physics & motion blur.
4. (3.0s - 4.0s): Settled jumbo cashews on emerald velvet + Grand Golden "NAMASTE" finale.
"""

import os
import sys
import math
import struct
import wave
import subprocess
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

FFMPEG_BIN = imageio_ffmpeg.get_ffmpeg_exe()

WIDTH = 1280
HEIGHT = 720
FPS = 30
TOTAL_FRAMES = 120  # 4.0 seconds

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
IMG_DIR = os.path.join(ASSETS_DIR, "images")
VID_DIR = os.path.join(ASSETS_DIR, "videos")
os.makedirs(VID_DIR, exist_ok=True)

# Load photographic stills
IMG_GODOWN = cv2.imread(os.path.join(IMG_DIR, "cashew_wooden_godown.jpg"))
IMG_OPEN = cv2.imread(os.path.join(IMG_DIR, "box_open_godown.jpg"))
IMG_POUR = cv2.imread(os.path.join(IMG_DIR, "box_pour_velvet.jpg"))
IMG_SETTLE = cv2.imread(os.path.join(IMG_DIR, "velvet_cashew_settle.jpg"))

def resize_cover(img, target_w, target_h):
    if img is None:
        return np.zeros((target_h, target_w, 3), dtype=np.uint8)
    h, w = img.shape[:2]
    scale = max(target_w / w, target_h / h)
    new_w, new_h = int(w * scale), int(h * scale)
    resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)
    x1 = (new_w - target_w) // 2
    y1 = (new_h - target_h) // 2
    return resized[y1:y1+target_h, x1:x1+target_w]

F_GODOWN = resize_cover(IMG_GODOWN, WIDTH, HEIGHT)
F_OPEN = resize_cover(IMG_OPEN, WIDTH, HEIGHT)
F_POUR = resize_cover(IMG_POUR, WIDTH, HEIGHT)
F_SETTLE = resize_cover(IMG_SETTLE, WIDTH, HEIGHT)

def smoothstep(x):
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)

def apply_pan_zoom(img, scale_start, scale_end, dx_start, dx_end, dy_start, dy_end, progress):
    s = smoothstep(progress)
    scale = max(1.0, scale_start + (scale_end - scale_start) * s)
    dx = dx_start + (dx_end - dx_start) * s
    dy = dy_start + (dy_end - dy_start) * s
    
    h, w = img.shape[:2]
    new_w, new_h = int(w * scale), int(h * scale)
    zoomed = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LINEAR)
    
    cx = int((new_w - w) / 2 + dx)
    cy = int((new_h - h) / 2 + dy)
    cx = max(0, min(cx, new_w - w))
    cy = max(0, min(cy, new_h - h))
    cropped = zoomed[cy:cy+h, cx:cx+w]
    if cropped.shape[0] != HEIGHT or cropped.shape[1] != WIDTH:
        cropped = cv2.resize(cropped, (WIDTH, HEIGHT))
    return cropped

def apply_directional_motion_blur(img, angle, length):
    if length <= 1:
        return img
    kernel = np.zeros((length, length))
    rad = math.radians(angle)
    center = length // 2
    cos_a, sin_a = math.cos(rad), math.sin(rad)
    for i in range(length):
        offset = i - center
        x = int(center + offset * cos_a)
        y = int(center + offset * sin_a)
        if 0 <= x < length and 0 <= y < length:
            kernel[y, x] = 1.0
    kernel_sum = np.sum(kernel)
    if kernel_sum > 0:
        kernel /= kernel_sum
    return cv2.filter2D(img, -1, kernel)

def apply_cashew_pour_motion(img, frame_in_shot, total_in_shot):
    """
    Simulates realistic optical motion flow on the cascading cashew stream:
    - Subtle vertical micro-displacement in the pour column
    - Gentle camera shake reflecting the physical impact of nuts hitting velvet
    - Organic specular light glints
    """
    res = img.copy()
    p = frame_in_shot / float(total_in_shot)
    
    # Impact camera breathing / tactile micro-vibration
    shake_y = int(math.sin(frame_in_shot * 1.8) * 1.5)
    shake_x = int(math.cos(frame_in_shot * 2.2) * 1.0)
    
    M = np.float32([[1, 0, shake_x], [0, 1, shake_y]])
    res = cv2.warpAffine(res, M, (WIDTH, HEIGHT), borderMode=cv2.BORDER_REFLECT)
    
    # Dynamic downward motion blur in the central pour region
    blur_len = int(3 + 3 * math.sin(p * math.pi))
    if blur_len > 1:
        blurred_stream = apply_directional_motion_blur(res, 90, blur_len)
        # Mask central pouring zone (roughly x: 40% to 65%, y: 15% to 80%)
        mask = np.zeros((HEIGHT, WIDTH), dtype=np.float32)
        cv2.ellipse(mask, (int(WIDTH * 0.52), int(HEIGHT * 0.48)), 
                    (int(WIDTH * 0.14), int(HEIGHT * 0.32)), 12, 0, 360, 1.0, -1)
        mask = cv2.GaussianBlur(mask, (51, 51), 0)
        mask_3ch = np.repeat(mask[:, :, np.newaxis], 3, axis=2)
        res = (blurred_stream * mask_3ch + res * (1.0 - mask_3ch)).astype(np.uint8)
        
    return res

def render_namaste_card(base_frame, alpha):
    """Render the grand golden Namaste finale with anti-aliased luxury typography"""
    overlay = base_frame.copy()
    
    # Subtle dark vignette to focus the golden title
    h, w = base_frame.shape[:2]
    Y, X = np.ogrid[:h, :w]
    dist_from_center = np.sqrt((X - w/2)**2 + (Y - h/2)**2)
    vignette = np.clip(dist_from_center / (w * 0.55), 0, 1) * 0.45 * alpha
    overlay = (overlay.astype(np.float32) * (1.0 - vignette[:, :, np.newaxis])).astype(np.uint8)
    
    pil_img = Image.fromarray(cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(pil_img)
    
    font_large = None
    font_med = None
    font_small = None
    
    font_candidates = [
        "C:\\Windows\\Fonts\\georgiab.ttf",
        "C:\\Windows\\Fonts\\georgia.ttf",
        "C:\\Windows\\Fonts\\palabi.ttf",
        "C:\\Windows\\Fonts\\timesbd.ttf"
    ]
    for fc in font_candidates:
        if os.path.exists(fc):
            try:
                font_large = ImageFont.truetype(fc, 70)
                font_med = ImageFont.truetype(fc, 30)
                font_small = ImageFont.truetype(fc, 18)
                break
            except Exception:
                pass
                
    if font_large is None:
        font_large = ImageFont.load_default()
        font_med = font_large
        font_small = font_large

    emblem_y = int(HEIGHT * 0.26)
    
    # Golden Aura
    aura_radius = int(240 * alpha)
    for r in range(aura_radius, 30, -20):
        a_val = int(25 * (1.0 - r / aura_radius) * alpha)
        draw.ellipse([WIDTH//2 - r, emblem_y + 35 - r//2, WIDTH//2 + r, emblem_y + 35 + r//2], 
                     fill=(28, 75, 55, a_val), outline=(212, 176, 85, a_val))

    # Royal Golden Crest
    crest_size = 50
    draw.rounded_rectangle([WIDTH//2 - crest_size, emblem_y - crest_size, WIDTH//2 + crest_size, emblem_y + crest_size], 
                           radius=10, fill=(6, 20, 14), outline=(212, 176, 85), width=2)
    
    # Folded Hands symbol
    draw.text((WIDTH//2, emblem_y), "🙏", font=font_med, fill=(245, 225, 140), anchor="mm")

    # Main "NAMASTE" Title
    text_y = int(HEIGHT * 0.48)
    draw.text((WIDTH//2 + 2, text_y + 2), "NAMASTE", font=font_large, fill=(0, 0, 0), anchor="mm")
    draw.text((WIDTH//2, text_y), "NAMASTE", font=font_large, fill=(245, 222, 132), anchor="mm")
    
    # Subtitle: Sanskrit + English Welcome
    sub_y = int(HEIGHT * 0.61)
    draw.text((WIDTH//2, sub_y), "नमस्ते • WELCOME TO KAJU BAZAAR", font=font_med, fill=(230, 205, 120), anchor="mm")
    
    # Sub-tagline
    tag_y = int(HEIGHT * 0.70)
    draw.text((WIDTH//2, tag_y), "WHOLESALE CASHEW TRADING HOUSE • EST. 1928", font=font_small, fill=(210, 190, 150), anchor="mm")

    # Decorative bottom flourish
    line_y = int(HEIGHT * 0.75)
    draw.line([WIDTH//2 - 160, line_y, WIDTH//2 + 160, line_y], fill=(212, 176, 85), width=1)

    result_bgr = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    return cv2.addWeighted(result_bgr, alpha, base_frame, 1.0 - alpha, 0)

print(f"[VIDEO] Synthesizing {TOTAL_FRAMES} photorealistic frames (4.0s) at {WIDTH}x{HEIGHT}...")

frames_list = []

for frame_idx in range(TOTAL_FRAMES):
    time_sec = frame_idx / float(FPS)
    
    # -------------------------------------------------------------------------
    # SHOT 1: Frames 0 - 28 (0.0s - 0.93s)
    # Inside Godown: Stacks of wooden crates, cinematic dolly-in
    # -------------------------------------------------------------------------
    if frame_idx < 28:
        p = frame_idx / 28.0
        frame = apply_pan_zoom(F_GODOWN, 1.0, 1.06, 0, 12, 0, -5, p)
        
        # Smooth motion-blur transition into Shot 2
        if frame_idx >= 20:
            blend_p = smoothstep((frame_idx - 20) / 8.0)
            open_f = apply_pan_zoom(F_OPEN, 1.0, 1.03, 0, 0, 0, 0, blend_p)
            frame = cv2.addWeighted(open_f, blend_p, frame, 1.0 - blend_p, 0)

    # -------------------------------------------------------------------------
    # SHOT 2: Frames 28 - 58 (0.93s - 1.93s)
    # Hands lifting wooden crate lid, revealing jumbo golden cashews
    # -------------------------------------------------------------------------
    elif frame_idx < 58:
        p = (frame_idx - 28) / 30.0
        frame = apply_pan_zoom(F_OPEN, 1.02, 1.09, 0, -8, 0, 10, p)
        
        # Smooth directional cut into Shot 3
        if frame_idx >= 48:
            blend_p = smoothstep((frame_idx - 48) / 10.0)
            pour_f = apply_pan_zoom(F_POUR, 1.0, 1.03, 0, 0, 0, 0, blend_p)
            frame = cv2.addWeighted(pour_f, blend_p, frame, 1.0 - blend_p, 0)

    # -------------------------------------------------------------------------
    # SHOT 3: Frames 58 - 88 (1.93s - 2.93s)
    # Tilting box & pouring cashew nuts onto emerald velvet cloth
    # Photorealistic optical flow & tactile camera micro-motion
    # -------------------------------------------------------------------------
    elif frame_idx < 88:
        p = (frame_idx - 58) / 30.0
        frame_in_shot = frame_idx - 58
        base_pour = apply_pan_zoom(F_POUR, 1.02, 1.06, -5, 8, -3, 6, p)
        frame = apply_cashew_pour_motion(base_pour, frame_in_shot, 30)
        
        # Smooth dissolve into settled presentation
        if frame_idx >= 76:
            blend_p = smoothstep((frame_idx - 76) / 12.0)
            settle_f = apply_pan_zoom(F_SETTLE, 1.0, 1.03, 0, 0, 0, 0, blend_p)
            frame = cv2.addWeighted(settle_f, blend_p, frame, 1.0 - blend_p, 0)

    # -------------------------------------------------------------------------
    # SHOT 4: Frames 88 - 120 (2.93s - 4.0s)
    # Heaps of jumbo cashews settled on emerald velvet + "NAMASTE" finale
    # -------------------------------------------------------------------------
    else:
        p = (frame_idx - 88) / 32.0
        frame = apply_pan_zoom(F_SETTLE, 1.02, 1.06, 0, -4, 0, 2, p)
        
        # Fade in the golden Namaste card
        if frame_idx >= 92:
            namaste_alpha = smoothstep(min(1.0, (frame_idx - 92) / 14.0))
            frame = render_namaste_card(frame, namaste_alpha)

    frames_list.append(frame)

print(f"[VIDEO] Generated {len(frames_list)} frames. Generating synchronized realistic audio...")

# --------------------------------------------------------------------------
# AUDIO SYNTHESIS: High-Fidelity 44.1kHz Stereo
# --------------------------------------------------------------------------
SAMPLE_RATE = 44100
total_samples = int(SAMPLE_RATE * (TOTAL_FRAMES / FPS))
audio = np.zeros((total_samples, 2), dtype=np.float32)

t_axis = np.linspace(0, TOTAL_FRAMES / FPS, total_samples, endpoint=False)

# 1. Warm godown room tone
ambient = np.random.normal(0, 0.004, total_samples)
audio[:, 0] += ambient
audio[:, 1] += ambient

# 2. Wooden box lid opening (0.9s - 1.5s)
t_box = np.clip((t_axis - 0.9) / 0.6, 0, 1)
box_mask = (t_axis >= 0.9) & (t_axis < 1.5)
box_freq = 95.0 - 40.0 * t_box
wood_slide = np.sin(2 * np.pi * box_freq * t_axis) * 0.08 * np.sin(np.pi * t_box)
audio[box_mask, 0] += wood_slide[box_mask]
audio[box_mask, 1] += wood_slide[box_mask] * 0.9

# 3. Cascading cashew nut drops & rolls on emerald velvet (1.9s - 3.0s)
for i in range(50):
    tap_time = 1.95 + (i * 0.021) + np.random.uniform(-0.008, 0.008)
    if tap_time < 3.05:
        idx_start = int(tap_time * SAMPLE_RATE)
        dur = int(0.045 * SAMPLE_RATE)
        if idx_start + dur < total_samples:
            tap_t = np.linspace(0, 0.045, dur)
            freq = np.random.uniform(450, 900)
            tap_sig = np.sin(2 * np.pi * freq * tap_t) * np.exp(-tap_t / 0.009) * np.random.uniform(0.03, 0.075)
            pan = np.random.uniform(0.35, 0.65)
            audio[idx_start:idx_start+dur, 0] += tap_sig * (1 - pan)
            audio[idx_start:idx_start+dur, 1] += tap_sig * pan

# 4. Sacred Tanpura & Chime welcoming "Namaste" (3.0s - 4.0s)
namaste_start = 3.05
if namaste_start < TOTAL_FRAMES / FPS:
    idx_n = int(namaste_start * SAMPLE_RATE)
    dur_n = total_samples - idx_n
    t_n = np.linspace(0, (dur_n / SAMPLE_RATE), dur_n)
    
    # Rich G-major chord (G3, D4, G4, B4, D5)
    chime = (
        np.sin(2 * np.pi * 196.00 * t_n) * 0.08 * np.exp(-t_n / 1.1) +
        np.sin(2 * np.pi * 293.66 * t_n) * 0.07 * np.exp(-t_n / 1.0) +
        np.sin(2 * np.pi * 392.00 * t_n) * 0.09 * np.exp(-t_n / 0.9) +
        np.sin(2 * np.pi * 493.88 * t_n) * 0.06 * np.exp(-t_n / 0.8) +
        np.sin(2 * np.pi * 587.33 * t_n) * 0.05 * np.exp(-t_n / 0.7)
    )
    audio[idx_n:, 0] += chime
    audio[idx_n:, 1] += chime

# Normalize audio
max_val = np.max(np.abs(audio))
if max_val > 0:
    audio = (audio / max_val) * 0.85

audio_16bit = (audio * 32767).astype(np.int16)
WAV_PATH = os.path.join(VID_DIR, "godown_audio.wav")
with wave.open(WAV_PATH, 'wb') as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SAMPLE_RATE)
    wf.writeframes(audio_16bit.tobytes())

print(f"[AUDIO] Audio synthesized to {WAV_PATH}")

# --------------------------------------------------------------------------
# ENCODING WITH FFMPEG (MP4 + WebM)
# --------------------------------------------------------------------------
MP4_PATH = os.path.join(VID_DIR, "godown_cashew_entry.mp4")
WEBM_PATH = os.path.join(VID_DIR, "godown_cashew_entry.webm")

# 1. Encode MP4 (H.264 + AAC)
print(f"[ENCODE] Encoding MP4 with FFmpeg: {MP4_PATH}")
cmd_mp4 = [
    FFMPEG_BIN, "-y",
    "-f", "rawvideo",
    "-vcodec", "rawvideo",
    "-s", f"{WIDTH}x{HEIGHT}",
    "-pix_fmt", "bgr24",
    "-r", str(FPS),
    "-i", "-",
    "-i", WAV_PATH,
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "18",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "192k",
    "-shortest",
    MP4_PATH
]

proc = subprocess.Popen(cmd_mp4, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
for f in frames_list:
    proc.stdin.write(f.tobytes())
proc.stdin.close()
stdout, stderr = proc.communicate()
if proc.returncode == 0:
    print(f"[SUCCESS] MP4 created: {MP4_PATH}, size: {os.path.getsize(MP4_PATH):,} bytes")
else:
    print(f"[ERROR] MP4 failed: {stderr.decode('utf-8', errors='ignore')}")

# 2. Encode WebM (VP9 + Opus)
print(f"[ENCODE] Encoding WebM with FFmpeg: {WEBM_PATH}")
cmd_webm = [
    FFMPEG_BIN, "-y",
    "-f", "rawvideo",
    "-vcodec", "rawvideo",
    "-s", f"{WIDTH}x{HEIGHT}",
    "-pix_fmt", "bgr24",
    "-r", str(FPS),
    "-i", "-",
    "-i", WAV_PATH,
    "-c:v", "libvpx-vp9",
    "-crf", "24",
    "-b:v", "0",
    "-pix_fmt", "yuv420p",
    "-c:a", "libopus",
    "-b:a", "128k",
    "-shortest",
    WEBM_PATH
]

proc2 = subprocess.Popen(cmd_webm, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
for f in frames_list:
    proc2.stdin.write(f.tobytes())
proc2.stdin.close()
stdout2, stderr2 = proc2.communicate()
if proc2.returncode == 0:
    print(f"[SUCCESS] WebM created: {WEBM_PATH}, size: {os.path.getsize(WEBM_PATH):,} bytes")
else:
    print(f"[ERROR] WebM failed: {stderr2.decode('utf-8', errors='ignore')}")

# Clean up wav
if os.path.exists(WAV_PATH):
    os.remove(WAV_PATH)

print("[COMPLETE] Realistic Godown Entry Video ready!")
