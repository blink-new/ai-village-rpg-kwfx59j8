import { Entity } from '../types/world';
import { WorldGenerator } from './WorldGenerator';

export interface Vector2D {
  x: number;
  y: number;
}

export interface PhysicsBody {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: Vector2D;
  acceleration: Vector2D;
  mass: number;
  friction: number;
  restitution: number; // bounciness
  isStatic: boolean;
  isGrounded: boolean;
  canJump: boolean;
}

export class PhysicsEngine {
  private bodies: Map<string, PhysicsBody> = new Map();
  private worldGenerator: WorldGenerator;
  private gravity: Vector2D = { x: 0, y: 980 }; // pixels/second²
  private timeStep: number = 1 / 60; // 60 FPS

  constructor(worldGenerator: WorldGenerator) {
    this.worldGenerator = worldGenerator;
  }

  addBody(body: PhysicsBody): void {
    this.bodies.set(body.id, body);
  }

  removeBody(id: string): void {
    this.bodies.delete(id);
  }

  getBody(id: string): PhysicsBody | undefined {
    return this.bodies.get(id);
  }

  // Check collision between two rectangles
  private checkCollision(a: PhysicsBody, b: PhysicsBody): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  // Check collision with world terrain
  private checkTerrainCollision(body: PhysicsBody): boolean {
    const tileSize = 32;
    const startX = Math.floor(body.x / tileSize);
    const endX = Math.floor((body.x + body.width) / tileSize);
    const startY = Math.floor(body.y / tileSize);
    const endY = Math.floor((body.y + body.height) / tileSize);

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const tile = this.worldGenerator.getWorldTile(x, y);
        if (tile.solid) {
          return true;
        }
      }
    }
    return false;
  }

  // Resolve collision between body and terrain
  private resolveTerrainCollision(body: PhysicsBody): void {
    const tileSize = 32;
    const originalX = body.x;
    const originalY = body.y;

    // Check horizontal collision
    if (this.checkTerrainCollision(body)) {
      body.x = originalX;
      body.velocity.x = 0;
    }

    // Check vertical collision
    body.y = originalY;
    if (this.checkTerrainCollision(body)) {
      body.y = originalY;
      if (body.velocity.y > 0) {
        body.isGrounded = true;
        body.canJump = true;
      }
      body.velocity.y = 0;
    } else {
      body.isGrounded = false;
    }
  }

  // Apply forces and integrate motion
  private integrate(body: PhysicsBody): void {
    if (body.isStatic) return;

    // Apply gravity
    if (!body.isGrounded) {
      body.acceleration.y += this.gravity.y;
    }

    // Apply friction
    body.velocity.x *= (1 - body.friction);

    // Update velocity
    body.velocity.x += body.acceleration.x * this.timeStep;
    body.velocity.y += body.acceleration.y * this.timeStep;

    // Limit velocity
    const maxVelocity = 1000;
    body.velocity.x = Math.max(-maxVelocity, Math.min(maxVelocity, body.velocity.x));
    body.velocity.y = Math.max(-maxVelocity, Math.min(maxVelocity, body.velocity.y));

    // Update position
    const newX = body.x + body.velocity.x * this.timeStep;
    const newY = body.y + body.velocity.y * this.timeStep;

    body.x = newX;
    body.y = newY;

    // Reset acceleration
    body.acceleration.x = 0;
    body.acceleration.y = 0;
  }

  // Apply impulse to body
  applyImpulse(bodyId: string, impulse: Vector2D): void {
    const body = this.bodies.get(bodyId);
    if (!body || body.isStatic) return;

    body.velocity.x += impulse.x / body.mass;
    body.velocity.y += impulse.y / body.mass;
  }

  // Apply force to body
  applyForce(bodyId: string, force: Vector2D): void {
    const body = this.bodies.get(bodyId);
    if (!body || body.isStatic) return;

    body.acceleration.x += force.x / body.mass;
    body.acceleration.y += force.y / body.mass;
  }

  // Make body jump
  jump(bodyId: string, force: number = 500): void {
    const body = this.bodies.get(bodyId);
    if (!body || !body.canJump) return;

    this.applyImpulse(bodyId, { x: 0, y: -force });
    body.canJump = false;
    body.isGrounded = false;
  }

  // Main physics update loop
  update(): void {
    // Integration phase
    for (const body of this.bodies.values()) {
      this.integrate(body);
    }

    // Collision detection and resolution
    for (const body of this.bodies.values()) {
      if (!body.isStatic) {
        this.resolveTerrainCollision(body);
      }
    }

    // Body-to-body collision detection
    const bodyArray = Array.from(this.bodies.values());
    for (let i = 0; i < bodyArray.length; i++) {
      for (let j = i + 1; j < bodyArray.length; j++) {
        const bodyA = bodyArray[i];
        const bodyB = bodyArray[j];

        if (bodyA.isStatic && bodyB.isStatic) continue;

        if (this.checkCollision(bodyA, bodyB)) {
          this.resolveBodyCollision(bodyA, bodyB);
        }
      }
    }
  }

  // Resolve collision between two bodies
  private resolveBodyCollision(bodyA: PhysicsBody, bodyB: PhysicsBody): void {
    // Simple elastic collision resolution
    const dx = (bodyA.x + bodyA.width / 2) - (bodyB.x + bodyB.width / 2);
    const dy = (bodyA.y + bodyA.height / 2) - (bodyB.y + bodyB.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return;

    const normalX = dx / distance;
    const normalY = dy / distance;

    // Separate bodies
    const overlap = (bodyA.width + bodyB.width) / 2 - Math.abs(dx);
    if (overlap > 0) {
      const separationX = normalX * overlap * 0.5;
      const separationY = normalY * overlap * 0.5;

      if (!bodyA.isStatic) {
        bodyA.x += separationX;
        bodyA.y += separationY;
      }
      if (!bodyB.isStatic) {
        bodyB.x -= separationX;
        bodyB.y -= separationY;
      }
    }

    // Calculate relative velocity
    const relativeVelocityX = bodyA.velocity.x - bodyB.velocity.x;
    const relativeVelocityY = bodyA.velocity.y - bodyB.velocity.y;

    // Calculate relative velocity in collision normal direction
    const velocityAlongNormal = relativeVelocityX * normalX + relativeVelocityY * normalY;

    // Do not resolve if velocities are separating
    if (velocityAlongNormal > 0) return;

    // Calculate restitution
    const restitution = Math.min(bodyA.restitution, bodyB.restitution);

    // Calculate impulse scalar
    let impulseScalar = -(1 + restitution) * velocityAlongNormal;
    impulseScalar /= (1 / bodyA.mass) + (1 / bodyB.mass);

    // Apply impulse
    const impulseX = impulseScalar * normalX;
    const impulseY = impulseScalar * normalY;

    if (!bodyA.isStatic) {
      bodyA.velocity.x += impulseX / bodyA.mass;
      bodyA.velocity.y += impulseY / bodyA.mass;
    }
    if (!bodyB.isStatic) {
      bodyB.velocity.x -= impulseX / bodyB.mass;
      bodyB.velocity.y -= impulseY / bodyB.mass;
    }
  }

  // Get all bodies in a region
  getBodiesInRegion(x: number, y: number, width: number, height: number): PhysicsBody[] {
    const result: PhysicsBody[] = [];
    
    for (const body of this.bodies.values()) {
      if (
        body.x < x + width &&
        body.x + body.width > x &&
        body.y < y + height &&
        body.y + body.height > y
      ) {
        result.push(body);
      }
    }
    
    return result;
  }

  // Raycast from point in direction
  raycast(startX: number, startY: number, dirX: number, dirY: number, maxDistance: number): {
    hit: boolean;
    x: number;
    y: number;
    distance: number;
    body?: PhysicsBody;
  } {
    const stepSize = 2;
    const steps = Math.floor(maxDistance / stepSize);
    
    for (let i = 0; i < steps; i++) {
      const x = startX + dirX * i * stepSize;
      const y = startY + dirY * i * stepSize;
      
      // Check terrain collision
      const tile = this.worldGenerator.getWorldTile(Math.floor(x / 32), Math.floor(y / 32));
      if (tile.solid) {
        return {
          hit: true,
          x,
          y,
          distance: i * stepSize
        };
      }
      
      // Check body collision
      for (const body of this.bodies.values()) {
        if (x >= body.x && x <= body.x + body.width &&
            y >= body.y && y <= body.y + body.height) {
          return {
            hit: true,
            x,
            y,
            distance: i * stepSize,
            body
          };
        }
      }
    }
    
    return {
      hit: false,
      x: startX + dirX * maxDistance,
      y: startY + dirY * maxDistance,
      distance: maxDistance
    };
  }
}