var introductionSection = document.getElementById('introduction-section');

        // Get the height of the introduction section
var introductionSectionHeight = introductionSection.clientHeight;

console.log("Height of Introduction Section:", introductionSectionHeight, "pixels");

let boyle = function(p) {

    let canvas_width = p.windowWidth * 0.7;
    let canvas_height = 500;

    let particles = [] 
    let number_of_particles = 53;
    let pressure = 0, volume = 100;
    let particle_temperature = 273.15;
    let space_width = canvas_width * 0.5;
    let space_height = 390;
    let actual_width = 20 * Math.pow(10, -9)
    let actual_depth = 10 * Math.pow(10, -9)
    let actual_height = 10 * Math.pow(10, -9)
    const boltzmann_constant = 1.38 * Math.pow(10, -23);

    // Particle class with position and velocity
    class Particle {
        // constructor
        constructor() {
            this.position = p.createVector(p.random(0, space_width), p.random(0, space_height));
            this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 1));
            this.velocity.setMag(p.random(2, 4));
        }
        // update the position, display and check for edge collision
        show() {
            p.fill(229, 107, 111);
            p.circle(this.position.x, this.position.y, 10);
            this.position.add(this.velocity);
            if (this.position.x <= 5) {
                this.position.x = 5;
                this.velocity.x *= -1;
            }
            else if (this.position.x >= space_width - 5) {
                this.position.x = space_width - 5;
                this.velocity.x *= -1;
            }
            if (this.position.y <= 5) {
                this.position.y = 5;
                this.velocity.y *= -1;
            }
            else if (this.position.y >= space_height - 5) {
                this.position.y = space_height - 5;
                this.velocity.y *= -1;
            }
        }
    }

    let slider_width, text_pressure, text_volume;

    p.setup = function() {

      p.createCanvas(canvas_width, canvas_height);
      p.background(10, 68, 108); 

      for (let i = 0; i <= number_of_particles; i++) {
        particles.push(new Particle());
      }

      slider_width = p.createSlider(50, space_width, space_width, 1);
      slider_width.addClass("sliders");
      text_pressure = p.createElement('h4', "M");
      text_pressure.addClass("text_elements");
      text_volume = p.createElement('h4', "M");
      text_volume.addClass("text_elements");

    }
    
    p.draw = function() {

        introductionSectionHeight = introductionSection.clientHeight

        

        space_width = slider_width.value()
        actual_width = space_width / 25 * Math.pow(10, -9)
        volume = actual_depth * actual_height * actual_width
        pressure = number_of_particles * boltzmann_constant * particle_temperature / volume;

        p.noStroke()
        p.fill(10, 68, 108);

        p.rect(0, 0, canvas_width * 0.5 + 55, canvas_height);
        p.noFill();
        p.stroke(255);
        p.translate(50, 50);
        slider_width.position(p.windowWidth - canvas_width + 50, 1.25 * introductionSectionHeight + canvas_height + 20);
        text_pressure.position(p.windowWidth - canvas_width + 55, 1.25 * introductionSectionHeight + canvas_height - 20);
        text_volume.position(p.windowWidth - canvas_width + 55, 1.25 * introductionSectionHeight + canvas_height - 40);
        text_pressure.html("Pressure: " + p.str(p.round(pressure)) + " Pa");
        text_volume.html("Volume: " + p.str(p.round(volume * Math.pow(10, 27))) + " nm^3");
        

        p.stroke(255);
        p.rect(0, 0, space_width, space_height);
        p.noStroke();
        for (let i = 0; i <= number_of_particles; i++) {
            particles[i].show();
        }

        graph()


    }


    function graph() {
        
        p.translate(canvas_width * 0.45 + 100, space_height);
        p.stroke(255);
        p.line(0, 0, 0, -390);
        p.line(0, 0, canvas_width * 0.3, 0);
        p.strokeWeight(5);
        p.point(space_width * 0.5, -pressure * 3 / 10000);
        p.strokeWeight(1)
        p.noStroke();
        
    }
};

new p5(boyle, 'boyle');

