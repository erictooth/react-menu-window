type ViewportRect = {
    width: number;
    height: number;
};

type Rect = {
    width: number;
    height: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
};

export const fitsOnTop = (viewportOffset: number) => (elemRect: Rect) =>
    elemRect.top > viewportOffset;

export const fitsOnBottom = (viewportOffset: number) => (
    elemRect: Rect,
    viewportRect: ViewportRect
) => elemRect.bottom < viewportRect.height - viewportOffset;

export const fitsOnLeft = (viewportOffset: number) => (elemRect: Rect) =>
    elemRect.left > viewportOffset;

export const fitsOnRight = (viewportOffset: number) => (
    elemRect: Rect,
    viewportRect: ViewportRect
) => elemRect.right < viewportRect.width - viewportOffset;

export const fitsInViewport = (viewportOffset: number) => (elemRect: Rect) => {
    if (elemRect.width === 0 || elemRect.height === 0) {
        return true;
    }
    const viewportRect = {
        width: window.innerWidth,
        height: window.innerHeight,
    };
    return (
        fitsOnTop(viewportOffset)(elemRect) &&
        fitsOnBottom(viewportOffset)(elemRect, viewportRect) &&
        fitsOnLeft(viewportOffset)(elemRect) &&
        fitsOnRight(viewportOffset)(elemRect, viewportRect)
    );
};

export const getFitOffsets = (viewportOffset: number) => (elemRect: Rect) => {
    const viewportRect = {
        width: window.innerWidth,
        height: window.innerHeight,
    };
    const offsets = {
        x: 0,
        y: 0
    };

    if (!fitsOnRight(viewportOffset)(elemRect, viewportRect)) {
        offsets.x = viewportRect.width - viewportOffset - elemRect.right
    }

    if (!fitsOnBottom(viewportOffset)(elemRect, viewportRect)) {
        offsets.y = viewportRect.height - viewportOffset - elemRect.bottom
    }

    return offsets;
}
