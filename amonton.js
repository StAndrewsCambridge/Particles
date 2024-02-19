
// Amonton.js
let amonton = function(p) {
    let canvas_width = p.windowWidth * 0.7;
    let canvas_height = 500;

    let particles = [] 
    let number_of_particles = 53; //53.5
    let pressure, volume;
    let particle_temperature = 273.15;
    let space_width = canvas_width * 0.5; //20 nm
    let space_height = 390; //10 nm
    let actual_width = 20 * Math.pow(10, -9)
    let actual_depth = 10 * Math.pow(10, -9)
    let actual_height = 10 * Math.pow(10, -9)
    
    const boltzmann_constant = 1.38 * Math.pow(10, -23);

    // Molcule class with position and velocity
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


    let slider_temperature, text_pressure, text_temperature;

    p.setup = function() {

      p.createCanvas(canvas_width, canvas_height);
      p.background(10, 68, 108); 

      for (let i = 0; i <= number_of_particles; i++) {
        particles.push(new Particle());
      }
      slider_temperature = p.createSlider(10, 1000, particle_temperature, 1);
      slider_temperature.addClass("sliders");
      text_pressure = p.createElement('h4', "M");
      text_pressure.addClass("text_elements");
      text_temperature = p.createElement('h4', "M");
      text_temperature.addClass("text_elements");

      //graph_setup()
      

      
  
    }
    
    p.draw = function() {
        if (particle_temperature != slider_temperature.value()) {
            for (let particle of particles) {
                particle.velocity.mult(p.sqrt(slider_temperature.value() / particle_temperature));
            }
        }

        particle_temperature = slider_temperature.value()
        volume = actual_depth * actual_height * actual_width
        pressure = number_of_particles * boltzmann_constant * particle_temperature / volume;
        p.noStroke()
        p.fill(10, 68, 108);
        p.rect(0, 0, canvas_width * 0.5 + 55, canvas_height);
        p.noFill();
        p.stroke(255);
        p.translate(50, 50);
        slider_temperature.position(55, 1.5 * introductionSectionHeight + 500 + canvas_height + 20);
        text_pressure.position(55, 1.5 * introductionSectionHeight + 500 + canvas_height - 20);
        text_temperature.position(55, 1.5 * introductionSectionHeight + 500 + canvas_height - 40);
        text_pressure.html("Pressure: " + p.str(p.round(pressure)) + " Pa");
        text_temperature.html("Temperature: " + p.str(p.round(particle_temperature)) + " K");
        

        p.stroke(255);
        p.rect(0, 0, space_width, space_height);
        //p.rect(-50, -50, canvas_width, canvas_height);
        p.noStroke()
        for (let i = 0; i <= number_of_particles; i++) {
            particles[i].show()
        }

        graph()

        

    }


    function graph() {
        
        p.translate(canvas_width * 0.45 + 100, space_height);
        p.stroke(255);
        p.line(0, 0, 0, -390);
        p.line(0, 0, canvas_width * 0.3, 0);
        p.strokeWeight(5);
        p.point(p.map(particle_temperature, 10, 1000, 2, canvas_width * 0.3), -pressure / 1100);
        p.strokeWeight(1)
        p.noStroke();
        
    }
  };
    
  new p5(amonton, 'amonton');
  