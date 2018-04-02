import { Observable } from "rxjs";
export declare class Engine {
    private canvas;
    private ctx;
    frame: Observable<number>;
    onMove: Observable<{}>;
    onClick: Observable<{}>;
    mousePos: Vector2;
    size: {
        width: number;
        height: number;
        halfWidth: number;
        halfHeight: number;
    };
    gameObjects: GameObject<any>[];
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D);
    resize(): void;
    getMousePos(event: MouseEvent): {
        x: number;
        y: number;
    };
    draw(): void;
    physics(): void;
    collisionDetection<T>(obj: GameObject<T>): void;
}
export declare function lerp(start: Vector2, end: Vector2, interval: number): Vector2;
export declare class BoxHits {
    left: boolean;
    right: boolean;
    bottom: boolean;
    top: boolean;
    constructor(args?: Partial<BoxHits>);
}
export declare class CollisionHit<T, U> {
    collider: GameObject<T>;
    collidi: GameObject<U>;
    colliderHits: BoxHits;
    collidiHits: BoxHits;
    constructor(args: Partial<CollisionHit<T, U>>);
}
export declare class Vector2 {
    x: number;
    y: number;
    constructor(args: Partial<Vector2>);
}
export declare class Rect {
    width: number;
    height: number;
    readonly mesh: Vector2[];
    constructor(args: Partial<Rect>);
}
export declare class GameObject<T> {
    position: Vector2;
    velocity: Vector2;
    props: T;
    boundingBox: Rect;
    name: string;
    render: (ctx: CanvasRenderingContext2D) => (obj: GameObject<T>) => void;
    physics: (obj: GameObject<T>) => void;
    onCollision?: <U>(hit: CollisionHit<U, T>) => void;
    onClick?: (obj: GameObject<T>) => void;
    init: (obj: GameObject<T>) => void;
    constructor(...args: Partial<GameObject<T>>[]);
    drawBoundingBox(ctx: CanvasRenderingContext2D): void;
}
