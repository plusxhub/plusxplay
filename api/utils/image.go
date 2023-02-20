package utils

import (
	"errors"
	"image"
	"image/draw"
	"image/jpeg"
	"image/png"
	"io/ioutil"
	"math"
	"net/http"
	"os"
	"strings"

	"github.com/disintegration/imaging"
	"github.com/fogleman/gg"
	"github.com/golang/freetype/truetype"
)

func GetCoverImage(name, url string) (image.Image, error) {
	if len(name) > 20 {
		name = name[:20]
	}
	var pfp image.Image
	if url != "" {
		resp, err := http.Get(url)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			return nil, errors.New("Error when requesting for image")
		}
		contentType := resp.Header.Get("Content-Type")
		switch contentType {
		case "image/png":
			pfp, err = png.Decode(resp.Body)
			if err != nil {
				return nil, err
			}
		case "image/jpeg":
			pfp, err = jpeg.Decode(resp.Body)
			if err != nil {
				return nil, err
			}
		default:
			return nil, errors.New("Unsupported image used.")
		}
	} else {
		var err error
		pfp, err = gg.LoadImage("assets/guest.png")
		if err != nil {
			return nil, err
		}
	}

	base, err := gg.LoadImage("assets/PlusXPlay Base.png")
	if err != nil {
		return nil, err
	}

	side := math.Min(float64(pfp.Bounds().Dx()), float64(pfp.Bounds().Dy()))

	left := (pfp.Bounds().Dx() - int(side)) / 2
	top := (pfp.Bounds().Dy() - int(side)) / 2
	right := (pfp.Bounds().Dx() + int(side)) / 2
	bottom := (pfp.Bounds().Dy() + int(side)) / 2

	drawImg := image.NewRGBA(base.Bounds())

	cropRect := image.Rect(left, top, right, bottom)
	croppedPfp := pfp.(interface {
		SubImage(r image.Rectangle) image.Image
	}).SubImage(cropRect)

	enlargedImage := imaging.Resize(croppedPfp, 450, 450, imaging.Lanczos)

	// Paste the pfp onto the base image

	draw.Draw(drawImg, drawImg.Bounds(), base, image.Point{}, draw.Src)

	offset := image.Pt((base.Bounds().Dx()-enlargedImage.Bounds().Dx())/2, 425)
	draw.Draw(drawImg, enlargedImage.Bounds().Add(offset), enlargedImage, image.Point{}, draw.Over)

	baseCtx := gg.NewContextForImage(drawImg)
	fontBytes, err := ioutil.ReadFile("assets/arial.ttf")
	if err != nil {
		return nil, err
	}
	font, err := truetype.Parse(fontBytes)
	if err != nil {
		return nil, err
	}

	face := truetype.NewFace(font, &truetype.Options{
		Size: 40,
	})
	baseCtx.SetFontFace(face)

	textX := base.Bounds().Size().X / 2
	textY := 360

	baseCtx.SetRGB(1, 1, 1) // Set the text color to white
	baseCtx.DrawStringAnchored(strings.ToUpper(name), float64(textX), float64(textY), 0.5, 0.5)

	out, err := os.Create("/tmp/output.jpg")
	if err != nil {
		panic(err)
	}
	defer out.Close()
	jpeg.Encode(out, baseCtx.Image(), nil)

	return baseCtx.Image(), nil
}
