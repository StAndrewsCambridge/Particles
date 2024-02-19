/*
    developer:      Aleksandre Meskhi
    College:        St. Andrews College Cambridge
    file name:      Particle.js
    Contents:       Particle class definition, accessed by sketch.js and simulation.html
    External files: style.css and sketch.js
*/


// main class Particle
class particle {
    constructor() {
        // random position inside the container bounds
        this.position = createVector(random(0, space_width), random(0, space_height));
        // random kinetic energy of +-20% of the average spawning Kinetic energy
        this.kinetic_energy = random(average_spawn_KE * 0.8, average_spawn_KE * 1.2);
        // velocity with random direction
        this.velocity = createVector(random(-1, 1), random(-1, 1));
        // number of nucleons, relative mass
        this.relative_mass = relative_particle_mass;
        // actual mass of the Particles
        this.real_mass = this.relative_mass * 1.6 * pow(10, -27);
        // set the magnitude based on the KE and mass, KE = mv^2 / 2
        this.velocity.setMag(sqrt(this.kinetic_energy * 2 / this.real_mass))
        // color of the particles
        this.color = particle_color;
    }
    // displays the particles
    show() {
        // set the color to the particle color
        fill(this.color[0], this.color[1], this.color[2]);
        // circle at this.position with a diameter of 10
        circle(this.position.x, this.position.y, 10);
        // remove the color 
        noFill()
    }

    // calls show and collision check, updates the position of the particle
    update() {
        // change the position by adding this.velocity to it
        // velocity / 500 adjusted for the simulation to run smoothly and for the visibility of the particles
        // this division has no effect on the calculations
        this.collide_edges();
        this.position.add(this.velocity.x / 500, this.velocity.y / 500);
        // check for edge collision and handle the collision
        
        // display the molecule on the screen
        this.show()
    }
    
    // check and handle the collisions with the edges of the container
    collide_edges() {
        // molecule collision with left side of the container
        if (this.position.x <= 5) {
            this.position.x = 5;
            this.velocity.x *= -1;
        }
        // molecule collision with right side of the container
        else if (this.position.x >= space_width - 5) {
            this.position.x = space_width - 5;
            this.velocity.x *= -1;
        }
        // molecule collision with the top of the container
        if (this.position.y <= 5) {
            this.position.y = 5;
            this.velocity.y *= -1;
        }
        // molecule collision with the bottom of the container
        else if (this.position.y >= space_height - 5) {
            this.position.y = space_height - 5;
            this.velocity.y *= -1;
        }
    }

    // adjusting the attributes after the change of relative mass
    adjust_mass() {
        // as relative mass is changed, real mass needs to be calculated again
        this.real_mass = this.relative_mass * 1.6 * pow(10, -27);
        // the velocity needs to be adjusted as it is dependant on KE and mass
        this.velocity.setMag(sqrt(this.kinetic_energy * 2 / this.real_mass))
    }

    // adjusting the attributes after the change of particle temperature
    adjust_temperature() {
        // KE needs to be adjusted as temperature is a measure of KE of particles
        this.kinetic_energy = mag(this.velocity.x, this.velocity.y) * mag(this.velocity.x, this.velocity.y) * this.real_mass / 2;
    }
}

// end