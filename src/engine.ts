import {
    animationFrameScheduler,
    Observable,
    BehaviorSubject,
    interval,
    fromEvent
} from "rxjs";

import { map } from 'rxjs/operators';

export class Engine {
    frame = interval(0, animationFrameScheduler);
    onMove = fromEvent(document, 'mousemove');
    onClick = fromEvent(document, 'click');
    mousePos = new Vector2({x: 0, y: 0});
    size: { width: number, height: number, halfWidth: number, halfHeight: number };
    gameObjects: GameObject<any>[] = [];

    constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) {
        this.resize();
        this.frame.subscribe(this.physics.bind(this));
        this.frame.subscribe(this.draw.bind(this));
        this.onMove.pipe(map(e => this.getMousePos.bind(this)(e))).subscribe(p => this.mousePos = p);
        this.onClick.subscribe(e => this.gameObjects.filter(g => !!g.onClick).forEach(g => g.onClick(g)));
    }

    resize() {
        this.canvas.height = this.canvas.clientHeight;
        this.canvas.width = this.canvas.clientWidth;
        this.size = {
            width: this.canvas.width,
            height: this.canvas.height,
            halfWidth: this.canvas.width * 0.5,
            halfHeight: this.canvas.height * 0.5
        };
        this.ctx.translate(this.size.halfWidth, this.size.halfHeight);
    }

    getMousePos(event: MouseEvent) {
        return {
            x: event.clientX - this.size.halfWidth,
            y: event.clientY - this.size.halfHeight
        };
    }

    draw() {
        this.ctx.clearRect(-this.size.halfWidth, -this.size.halfHeight, this.size.width, this.size.height);
        this.gameObjects.forEach(obj => obj.render(this.ctx)(obj));
    }

    physics() {
        this.gameObjects.forEach(obj => {
            obj.position.x += obj.velocity.x;
            obj.position.y += obj.velocity.y;
            obj.physics(obj);
        });
    }

    collisionDetection<T>(obj: GameObject<T>) {
        let physicsObjects = this.gameObjects.filter(g => !!g.boundingBox);
        for (let i = 0; i < physicsObjects.length; i++) {
            let colObj = physicsObjects[i];
            if (colObj != obj) {
                let a = {
                    left: obj.position.x - obj.boundingBox.width * 0.5,
                    right: obj.position.x + obj.boundingBox.width * 0.5,
                    bottom: obj.position.y - obj.boundingBox.height * 0.5,
                    top: obj.position.y + obj.boundingBox.height * 0.5,
                };
                let b = {
                    left: colObj.position.x - colObj.boundingBox.width * 0.5,
                    right: colObj.position.x + colObj.boundingBox.width * 0.5,
                    bottom: colObj.position.y - colObj.boundingBox.height * 0.5,
                    top: colObj.position.y + colObj.boundingBox.height * 0.5,
                };

                let hits = {
                    left: (b.left > a.right),
                    right: (b.right < a.left),
                    top: (b.top < a.bottom),
                    bottom: (b.bottom > a.top),
                };

                if(!(hits.left || hits.right || hits.top || hits.bottom)) {
                    let colHits = {
                        left: a.left > b.right,
                        right: a.right < b.left,
                        top: a.top < b.bottom,
                        bottom: a.bottom > b.top,
                    };

                    let hit = new CollisionHit({
                        collider: obj,
                        collidi: colObj,
                        colliderHits: hits,
                        collidiHits: colHits
                    });
                    
                    colObj.onCollision.bind(this)(hit);
                    obj.onCollision.bind(this)(hit);
                }
            }
        }
    }

// // Specific Breakout methods.
//     wallBounce<T>(obj: GameObject<T>) {
//         let mesh = obj.boundingBox.mesh;
//         for (let i = 0; i < mesh.length; i++) {
//             let hit = false;
//             let point = mesh[i];
//             let p = { x: point.x + obj.position.x, y: point.x + obj.position.y };
//             if (p.x >= this.size.halfWidth || p.x <= -this.size.halfWidth) {
//                 obj.velocity.x *= -1;
//                 hit = true;
//             }

//             if (p.y <= -this.size.halfHeight) {
//                 obj.velocity.y *= -1;
//                 hit = true;
//             }

//             if (p.y >= this.size.halfHeight) {
//                 hit = true;
//                 this.scoreboardObject.props.score -= 150;
//                 this.gameObjects = this.gameObjects.filter(g => g.name !== 'ball');
//                 this.gameObjects.push(this.outOfBounds());
//             }

//             if (hit) { break; }
//         }
//     }
    
//     placeBlocks(rows: number) {
//         let colors = [
//             '#ef2e1c',
//             '#f16e1d',
//             '#f0d11d',
//             '#45bc32',
//             '#1f5dd1',
//         ];
//         const cellSize = { x: 150, y: 50 };
//         for (let y = 0; y < rows * cellSize.y; y += cellSize.y) {
//             let color = colors.shift();
//             for (let x = -this.size.halfWidth + (cellSize.x / 2) + this.size.width % cellSize.x/2; x < this.size.halfWidth; x += cellSize.x) {
//                 this.gameObjects.push(this.block({position: { x: x, y: y + -this.size.halfHeight + (rows * cellSize.y)/6 }, props: { color: color, pointValue: 25 }}));
//             }
//         }
//     }
}

export function lerp (start: Vector2, end: Vector2, interval: number) {
    if (interval > 1) { throw new Error('Interval must be less than 1!'); }
    let nLerp = (s: number, e: number, i: number) => {
        return (1-i)*s+i*e;
    }
    return new Vector2({ x: nLerp(start.x, end.x, interval), y: nLerp(start.y, end.y, interval)});
}

// export function dot (start: Vector2, end: Vector2) {
//     return start.x * end.x + start.y * end.y;
// }

// export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fill: boolean, stroke: boolean) {

//     if (typeof stroke == 'undefined') {
//       stroke = true;
//     }

//     if (typeof radius === 'undefined') {
//       radius = 5;
//     }
    
//     let radiusObj = {tl: radius, tr: radius, br: radius, bl: radius};

//     ctx.beginPath();
//     ctx.moveTo(x + radiusObj.tl, y);
//     ctx.lineTo(x + width - radiusObj.tr, y);
//     ctx.quadraticCurveTo(x + width, y, x + width, y + radiusObj.tr);
//     ctx.lineTo(x + width, y + height - radiusObj.br);
//     ctx.quadraticCurveTo(x + width, y + height, x + width - radiusObj.br, y + height);
//     ctx.lineTo(x + radiusObj.bl, y + height);
//     ctx.quadraticCurveTo(x, y + height, x, y + height - radiusObj.bl);
//     ctx.lineTo(x, y + radiusObj.tl);
//     ctx.quadraticCurveTo(x, y, x + radiusObj.tl, y);
//     ctx.closePath();
//     if (fill) {
//       ctx.fill();
//     }
//     if (stroke) {
//       ctx.stroke();
//     }
  
//   }

export class BoxHits {
    public left = false;
    public right = false;
    public bottom = false;
    public top = false;

    constructor(args: Partial<BoxHits> = {}) {
        Object.assign(this, args);
    }
}

export class CollisionHit<T, U> {
    public collider: GameObject<T>;
    public collidi: GameObject<U>;
    public colliderHits: BoxHits;
    public collidiHits: BoxHits;

    constructor(args: Partial<CollisionHit<T, U>>) {
        Object.assign(this, args);
    }
}

export class Vector2 {
    public x: number;
    public y: number;

    constructor(args: Partial<Vector2>) {
        Object.assign(this, args);
    }
}

export class Rect {
    public width: number;
    public height: number;

    public get mesh(): Vector2[] {
        let halfWidth = this.width * 0.5;
        let halfHeight = this.height * 0.5;
        return [
            { x: halfWidth, y: halfHeight },
            { x: halfWidth, y: -halfHeight },
            { x: -halfWidth, y: -halfHeight },
            { x: -halfWidth, y: halfHeight },
            // Add extra for drawing box.
            { x: halfWidth, y: halfHeight },
        ];
    }

    constructor(args: Partial<Rect>) {
        Object.assign(this, args);
    }
}

export class GameObject<T> {
    public position: Vector2;
    public velocity: Vector2;
    public props: T = {} as T;
    public boundingBox: Rect;
    public name: string;

    public render: (ctx: CanvasRenderingContext2D) => (obj: GameObject<T>) => void;
    public physics: (obj: GameObject<T>) => void = () => { };
    public onCollision?: <U>(hit: CollisionHit<U, T>) => void = () => { };
    public onClick?: (obj: GameObject<T>) => void;
    public init: (obj: GameObject<T>) => void;

    constructor(...args: Partial<GameObject<T>>[]) {
        Object.assign(this, ...args);
        if (!!this.init) {
            this.init(this);
        }
        this.render.bind(this);
    }

    drawBoundingBox(ctx: CanvasRenderingContext2D) {
        let mesh = this.boundingBox.mesh;
        ctx.beginPath();
        ctx.moveTo(mesh[0].x + this.position.x, mesh[0].y + this.position.y);
        ctx.strokeStyle = '#67fc7b';
        mesh.forEach(m => {
            ctx.lineTo(m.x + this.position.x, m.y + this.position.y);
        });
        ctx.closePath();
        ctx.stroke();
    }
}