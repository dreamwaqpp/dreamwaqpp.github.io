#!/bin/bash

# Convert all MP4 videos to WebM format for faster loading
# Requires ffmpeg to be installed: sudo apt-get install ffmpeg (or brew install ffmpeg on Mac)

INPUT_DIR="static/videos"
OUTPUT_DIR="static/videos"

echo "Converting MP4 videos to WebM format..."
echo "This will create optimized WebM versions for faster loading."
echo ""

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed."
    echo "Install it with: sudo apt-get install ffmpeg (Linux) or brew install ffmpeg (Mac)"
    exit 1
fi

# Count total files
total_files=0
for mp4 in "$INPUT_DIR"/*.mp4; do
    [ -f "$mp4" ] && ((total_files++))
done

current_file=0

# Convert each MP4 to WebM
for mp4 in "$INPUT_DIR"/*.mp4; do
    if [ -f "$mp4" ]; then
        ((current_file++))
        filename=$(basename "$mp4" .mp4)
        webm_path="$OUTPUT_DIR/$filename.webm"
        
        # Get file size for progress indication
        mp4_size=$(du -h "$mp4" | cut -f1)
        
        echo "[$current_file/$total_files] Converting: $filename.mp4 ($mp4_size)"
        echo "This may take a few minutes for large files..."
        echo "  (FFmpeg is working - you'll see frame/time updates below)"
        echo ""
        
        # Convert to WebM with optimized settings
        # Using libvpx-vp9 with speed=2 for faster encoding (still good quality)
        # -c:v libvpx-vp9: Use VP9 codec (best compression)
        # -crf 30: Quality setting (lower = better quality, 30 is good balance)
        # -b:v 0: Use CRF mode (constant rate factor)
        # -speed 2: Faster encoding (0-5, 2 is good balance)
        # -c:a libopus: Use Opus audio codec
        # -b:a 128k: Audio bitrate
        # -threads 4: Use 4 threads for faster processing
        
        # Run ffmpeg and show progress in real-time
        if ffmpeg -i "$mp4" \
            -c:v libvpx-vp9 \
            -crf 30 \
            -b:v 0 \
            -speed 2 \
            -c:a libopus \
            -b:a 128k \
            -threads 4 \
            -progress pipe:1 \
            -y \
            "$webm_path" 2>&1 | while IFS= read -r line; do
            # Show frame/time progress
            if [[ "$line" =~ frame=[0-9]+ ]]; then
                frame=$(echo "$line" | grep -oP 'frame=\K[0-9]+')
                time=$(echo "$line" | grep -oP 'time=\K[0-9:\.]+' || echo "")
                if [ ! -z "$time" ]; then
                    printf "\r  Processing... frame: %s, time: %s" "$frame" "$time"
                fi
            fi
        done; then
            echo "" # New line after progress
            webm_size=$(du -h "$webm_path" 2>/dev/null | cut -f1)
            if [ -f "$webm_path" ]; then
                echo "  ✓ Completed: $filename.webm ($webm_size)"
            else
                echo "  ✗ Failed to create: $filename.webm"
            fi
        else
            echo ""
            echo "  ✗ Failed to convert: $filename.mp4"
        fi
        echo ""
    fi
done

echo "Conversion complete!"
echo ""
echo "File size comparison:"
for mp4 in "$INPUT_DIR"/*.mp4; do
    if [ -f "$mp4" ]; then
        filename=$(basename "$mp4" .mp4)
        webm_path="$OUTPUT_DIR/$filename.webm"
        
        if [ -f "$webm_path" ]; then
            mp4_size=$(du -h "$mp4" | cut -f1)
            webm_size=$(du -h "$webm_path" | cut -f1)
            reduction=$(echo "scale=1; (1 - $(stat -f%z "$webm_path" 2>/dev/null || stat -c%s "$webm_path" 2>/dev/null) / $(stat -f%z "$mp4" 2>/dev/null || stat -c%s "$mp4" 2>/dev/null)) * 100" | bc 2>/dev/null || echo "N/A")
            echo "$filename: MP4=$mp4_size, WebM=$webm_size (${reduction}% smaller)"
        fi
    fi
done

