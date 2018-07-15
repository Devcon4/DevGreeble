import ResizeObserver from 'resize-observer-polyfill';
import { GameObject, Rect, Engine } from 'devcanvas';

export interface GreebleParams {
    // Width of grid in pixels.
    gridSize: {x: number, y: number};
    greebleTypes: GreebleType[];
}

export class GreebleType {
    gridSize = {x: 50, y: 50};
    artboardSize = {
        gridX: 1,
        gridY: 1,
        get x() { 
            return this.artboardSize.gridX * this.gridSize.x;
        },
        get y() {
            return this.artboardSize.gridY * this.gridSize.y;
        }
    };
}

export class GreebleObject<T> extends GameObject<T> {
    type: GreebleType;
    constructor(args: Partial<GreebleObject<T>>) {
        super();
        Object.assign(this, args);
    }
}

export class Greeble {

    engine: Engine;
    
    params: Partial<GreebleParams> = {
        greebleTypes: [],
        gridSize: {x: 50, y: 50}
    };

    greebleObjects: GreebleObject<any>[] = [];

    gridList: {height: number, objects: GreebleObject<any>[]}[] = [];

    constructor(primary: GreebleObject<any>[], params?: Partial<GreebleParams>) {
        this.params = params;

        let ro = new ResizeObserver(this.resize.bind(this));
        let canvas = document.getElementById('leftGutter') as HTMLCanvasElement;

        ro.observe(canvas);
        this.engine = new Engine(canvas, canvas.getContext('2d'));
        this.engine.gameObjects.push(this.debug());
    }

    debug = () => new GameObject({
        position: {x: 0, y: 0},
        velocity: {x: 0, y: 0},
        render: ctx => obj => {
            if(ctx instanceof CanvasRenderingContext2D) {
                console.log(this.engine.size);
                ctx.fillStyle = '#89f442';
                ctx.fillRect(-this.engine.size.halfWidth, -this.engine.size.halfHeight, this.engine.size.width, this.engine.size.height);
                ctx.fill();
            }
        }
    });

    resize(entries: ResizeObserverEntry[]) {
        for(let entry of entries) {
            if(entry.target instanceof HTMLCanvasElement) {
                entry.target.width = entry.contentRect.width;
                entry.target.height = entry.contentRect.height;
                this.engine.resize();
            }
        }
    }

    canAddObject<T>(obj: GreebleObject<T>) {

    }

    addRow() {
        
        let starterObj = this.params.greebleTypes[Math.round(Math.random() * GreebleType.length)];
        let remainingHeight = this.engine.size.height - this.gridList.map(r => r.height).reduce((prev, curr) => prev += curr);

        if(starterObj.artboardSize.y > remainingHeight) {
            return;
        }

        
    }
}