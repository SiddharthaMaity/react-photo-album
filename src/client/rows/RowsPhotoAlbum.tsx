import { forwardRef, useEffect, useRef, useState } from "react";

import { useContainerWidth } from "../hooks";
import StaticPhotoAlbum from "../../static";
import resolveRowsProps from "./resolveRowsProps";
import computeRowsLayout from "../../layouts/rows";
import { ElementRef, ForwardedRef, JSXElement, LayoutModel, Photo, RowsPhotoAlbumProps } from "../../types";

function RowsPhotoAlbum<TPhoto extends Photo>(
  { photos, breakpoints, defaultContainerWidth, ...rest }: RowsPhotoAlbumProps<TPhoto>,
  ref: ForwardedRef,
) {
  const { containerRef, containerWidth } = useContainerWidth(ref, breakpoints, defaultContainerWidth);
  const [layoutModel, setLayoutModel] = useState<LayoutModel<TPhoto> | undefined>(undefined);
  const prevPhotosCount = useRef(0);

  const { spacing, padding, targetRowHeight, minPhotos, maxPhotos, ...restProps } = resolveRowsProps(containerWidth, {
    photos,
    ...rest,
  });

  useEffect(() => {
    if (
      containerWidth !== undefined &&
      spacing !== undefined &&
      padding !== undefined &&
      targetRowHeight !== undefined
    ) {
      setLayoutModel((prevState) => {
        const rowsLayout = computeRowsLayout(
          photos?.slice(prevPhotosCount.current),
          spacing,
          padding,
          containerWidth,
          targetRowHeight,
          minPhotos,
          maxPhotos,
        );
        prevPhotosCount.current = photos.length;

        return prevState === undefined
          ? rowsLayout
          : { ...prevState, tracks: [...prevState.tracks, ...(rowsLayout?.tracks ?? [])] };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);

  useEffect(() => {
    if (
      containerWidth !== undefined &&
      spacing !== undefined &&
      padding !== undefined &&
      targetRowHeight !== undefined
    ) {
      setLayoutModel(
        computeRowsLayout(photos, spacing, padding, containerWidth, targetRowHeight, minPhotos, maxPhotos),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spacing, padding, targetRowHeight, minPhotos, maxPhotos]);

  return <StaticPhotoAlbum layout="rows" ref={containerRef} model={layoutModel} {...restProps} />;
}

export default forwardRef(RowsPhotoAlbum) as <TPhoto extends Photo>(
  props: RowsPhotoAlbumProps<TPhoto> & ElementRef,
) => JSXElement;
