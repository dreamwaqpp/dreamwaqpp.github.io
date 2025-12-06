#!/bin/bash

# Convert all PDF figures to PNG for web display
# Requires poppler-utils (pdftoppm)

INPUT_DIR="static/paper_images"
OUTPUT_DIR="static/paper_images/png"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo "Converting PDF figures to PNG..."

# Convert each PDF to PNG at 300 DPI for high quality
for pdf in "$INPUT_DIR"/*.pdf; do
    if [ -f "$pdf" ]; then
        filename=$(basename "$pdf" .pdf)
        echo "Converting: $filename.pdf"
        pdftoppm -png -r 300 -singlefile "$pdf" "$OUTPUT_DIR/$filename"
    fi
done

echo "Conversion complete! PNG files are in $OUTPUT_DIR"


