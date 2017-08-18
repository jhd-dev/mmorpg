'use strict';

const SAT = require('sat');

class Polygon extends SAT.Polygon {
    
    constructor(pos, points){
        super(new SAT.V(...pos), points.map(([x, y]) => new SAT.V(x, y)));
    }
    
    get boundingBox(){
        let x = this.points.reduce((acc, cur) => Math.min(acc, cur.x), Infinity);
        let y = this.points.reduce((acc, cur) => Math.min(acc, cur.y), Infinity);
        let width = this.points.reduce((acc, cur) => Math.max(acc, cur.x), -Infinity) - x;
        let height = this.points.reduce((acc, cur) => Math.max(acc, cur.y), -Infinity) - y;
        return new Rectangle([this.x, this.y], x, y, width, height);
    }
    
    testCollision(polygon){
        let response = new SAT.Response();
        return {
            collided: SAT.testPolygonPolygon(this, polygon, response),
            response: response
        };
    }
    
    isTouching(polygon){
        return this.testCollision(polygon).collided;
    }
    
}

class Rectangle extends Polygon {
    
    constructor(pos, x, y, width, height){//x=0;y=0;
        super(
            pos,
            [
                [x, y],
                [x + width, y],
                [x + width, y + height],
                [x, y + height]
            ]
        );
    }
    
    getPointOnEdge(h, v){ // [-1, -1] = top-left; [0, 0] = center; [1, 1] = bottom-right;
        return [this.x + h * this.width / 2, this.y + v * this.height / 2];
    }
    
}

class Ellipse extends Polygon {
    
    constructor(pos, x, y, xRadius, yRadius, accuracy = 4){
        let points = [];
        for (let i = 0; i < accuracy; i ++){
            let angle = 2 * i * Math.PI / accuracy;
            points[i] = [x + xRadius * Math.cos(angle), y + yRadius * Math.sin(angle)];
        }
        super(pos, points);
    }
    
}

class Square extends Rectangle {
    
    constructor(pos, x, y, s){
        super(pos, x, y, s, s);
    }
    
}

class Circle extends Ellipse {
    
    constructor(pos, x, y, radius, accuracy = 5){
        super(pos, x, y, radius, radius, accuracy);
    }
    
}

module.exports = {
    Vector: SAT.Vector,
    Polygon,
    Rectangle,
    Ellipse,
    Square,
    Circle
};
