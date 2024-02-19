/*
    developer:      Aleksandre Meskhi
    College:        St. Andrews College Cambridge
    file name:      sketch.js
    Contents:       Simulation of an ideal gas, accessed by Particle.js and simulation.html
    External files: style.css and Particle.js
*/

// array holding all of the molecule objects
const particles = [];
// boltzmann constant which is needed for calculations
const boltzmann_constant = 1.38 * Math.pow(10, -23);

// gas attributes at STP
const scale = Math.pow(10, -9); // metre to nano metres by multiplication
let particle_temperature = 273.15; // STP in kelvins
let relative_particle_mass = 4; // helium particles chosen
let average_spawn_KE = 5.65 * Math.pow(10, -21); // calculated based on the temperature of the particles
let pressure = 100000; // expected: 10^5 Pa or 100 KPa
let number_of_particles = 100; // value set to 100 by default. Changed after the first draw loop

// container dimensions
let space_width, space_height, space_depth, space_volume;
space_depth = 0.015; // 4 pm same as 0.004 nm. 0.004 chosen so that scaling is uniform
//slider elements
let slider_particle_number, slider_particle_temperature, slider_particle_mass;
let slider_width, slider_height;
// text elements
let volume_text, depth_text;
let pressure_text;
// color scheme
let particle_color = [237, 106, 141];
let background_color = [10, 68, 108];

//setup
function setup() {
  //creating and positioning the canvas
  setup_interface();
  // loop until number_of_particles particles are added to the array
  for (i = 0; i < number_of_particles; i++) {
    // initiate a new object, particle to the array for every itteration
    particles.push(new particle());
  }
}

// draw loop
function draw() {
  // caculate pressure
  // change the volume and calculate actual volume fo the container by multiplying values by scale
  space_volume = slider_height.slider.value() * scale * slider_width.slider.value() * scale * space_depth * scale
  // calculate the pressure using P = NKT/V
  pressure = number_of_particles * boltzmann_constant * slider_particle_temperature.slider.value() / space_volume;

  // display the interface
  draw_interface();
  // loop through every particle of the array 
  for (let particle of particles) {
    // update and display the particle
    particle.update()
  }


}


// draw interface
function draw_interface() {
  // translate the centre for padding
  translate(50, 150);
  // set the background color
  background(background_color); 
  // set the dimensions to the slider values
  // this is done on every itteration as changing a variable doesn't require too much computational power and time
  // using if statements would be unnecesary
  space_width = slider_width.slider.value();
  space_height = slider_height.slider.value();
  if (slider_width.slider.value() > windowWidth - 100) {
    space_width = windowWidth - 100;
    slider_width.slider.value(space_width);
  }
  if (space_height > windowHeight * 0.95 - 200) {
    space_height = windowHeight * 0.95 - 200;
    slider_height.slider.value(space_height);
  }
  
  // set stroke color
  stroke(218, 238, 244);
  // draw the container
  rect(0, 0, space_width, space_height);
  // remove stroke
  noStroke();
  // check if slider values have changed and handle the changed accordingly
  check_particle_sliders();
  // Refresh text values beside sliders
  slider_particle_number.value.text.html("Number of Particles: " + str(slider_particle_number.slider.value()));
  slider_particle_temperature.value.text.html("Temperature of Gas: " + str(slider_particle_temperature.slider.value()) + " K");
  slider_particle_mass.value.text.html("Nucleons per Particle: " + str(slider_particle_mass.slider.value()) + ", Mass: " + str(slider_particle_mass.slider.value()) + " * 1.67 * 10 ^ -27 kg");
  slider_width.value.text.html("Width: " + str(slider_width.slider.value()) + " nm");
  slider_height.value.text.html("Height: " + str(slider_height.slider.value()) + " nm");
  // Refresh other text elements
  volume_text.text.html("Volume of the container: " + str(Math.round(slider_height.slider.value() * slider_width.slider.value() * 0.004)) + " nm^3");
  depth_text.text.html("Depth: " + str(space_depth) + " nm")
  pressure_text.text.html("Pressure: " + str(pressure / 1000) + " KPa");
}

// check if slider values are updated
function check_particle_sliders() {
  // three independant if statements

  // number of particles changed:
  if (slider_particle_number.slider.value() != number_of_particles) {
    // number of particles increased
    if (slider_particle_number.slider.value() > number_of_particles) {
      // loop until the number of new particles have been added to the array
      for (i = 0; i < slider_particle_number.slider.value() - number_of_particles; i++) {
        // add a new particle for every itteration
        particles.push(new particle());
      }
    }
    // number of particles decreased
    else {
      // loop until the number of excess particles are removed form the array
      for (i = 0; i < number_of_particles - slider_particle_number.slider.value(); i++) {
        // remove the last added particle for every itteration
        particles.pop();
      }
    }
    // update the number of particles
    number_of_particles = slider_particle_number.slider.value();
  }

  // temperature changed
  if (slider_particle_temperature.slider.value() != particle_temperature) {
    // loop through every particle of the array
    for (let particle of particles) {
      // scale the velocity by multiplying it by the factor of change of temperature
      particle.velocity.mult((slider_particle_temperature.slider.value() / particle_temperature));
      // adjust the Kinetic energy of the particles
      particle.adjust_temperature()
    }
    // change the average spawn kinetic energy by multiplying it by the factor of change of temperature
    average_spawn_KE *= sq(slider_particle_temperature.slider.value() / particle_temperature)
    // set the temperature to new temperature
    particle_temperature = slider_particle_temperature.slider.value();
  }

  // mass changed
  if (slider_particle_mass.slider.value() != relative_particle_mass) {
    // loop through every particle of the array
    for (let particle of particles) {
      // change the mass of every particle
      particle.relative_mass = slider_particle_mass.slider.value();
      // adjust the real_mass and velocity attributes
      particle.adjust_mass()
    }
    // change the relative mass to new relative mass
    relative_particle_mass = slider_particle_mass.slider.value();
  }

  
}

// interface setup
function setup_interface() {
  // create and position the canvas
  canvas_main_simulation = createCanvas(windowWidth, windowHeight * 0.95);
  canvas_main_simulation.position(0, windowHeight * 0.05);
  canvas_main_simulation.style('z-index', '-1');
  // adjust the space_width and space_height based on the window dimensions
  space_width = windowWidth - 100;
  space_height = windowHeight * 0.95 - 200;
  // calculate the number of articles for the size of the container, as particles per cubic metre is constant at STP
  number_of_particles = int(pressure * space_depth * scale * space_width * scale * space_height * scale / (boltzmann_constant * particle_temperature))
 
  // particle number
  slider_particle_number = new Slider(10, 10, 10, 2000, number_of_particles, 1);
  //particle temperature
  slider_particle_temperature = new Slider(10, 30, 50, 600, particle_temperature, 0.001);
  // Particle mass
  slider_particle_mass = new Slider(10, 50, 1, 50, relative_particle_mass, 1);
  // space dimensions
  slider_width = new Slider(10, 70, 10, space_width, space_width, 0.2);
  slider_height = new Slider(10, 90, 10, space_height, space_height, 0.2);
  depth_text = new Text(windowWidth * 0.5 + 150, 50, 'h4')
  // space volume text
  volume_text = new Text(windowWidth * 0.5 + 150, 70, 'h4');
  // presure
  pressure_text = new Text(30, 100, 'h4');

}

// Slider Class
class Slider {
  // Recieves: position, range, initial value, step
  constructor(slider_position_x, slider_position_y, slider_range_min, slider_range_max, slider_initial_value, slider_step) {
    // creating the slider element
    this.slider = createSlider(Number(slider_range_min), Number(slider_range_max), Number(slider_initial_value), Number(slider_step));
    // set the position to the position recieved
    this.slider.position(Number(slider_position_x), Number(slider_position_y) + windowHeight * 0.05);
    // class added for later styling
    this.slider.addClass("sliders_simulation");
    // all sliders have a text field next to them
    // position adjusted so that the text is displayed next to the slider
    this.value = new Text(slider_position_x + windowWidth * 0.5 + 10, slider_position_y - 20, 'h4');
  }
}
// Text class
class Text {
  constructor(text_position_x, text_position_y, text_font_size) {
    // set the font size and create the element
    this.text = createElement(text_font_size, "");
    // set the position to the position recieved
    this.text.position(Number(text_position_x), Number(text_position_y + windowHeight * 0.05));
    // class added for later styling
    this.text.addClass("text_elements");
  }
}

// handle window dimension changes
function windowResized() {
  
  //rescale the window and other attributes such as windowsize etc, at runtime.
  if (space_width > windowWidth - 100) {
    space_width = windowWidth - 100;
    slider_width.slider.value(space_width)
  }

  if (space_height > windowHeight * 0.95 - 100) {
    space_height = windowHeight * 0.95 - 100;
    slider_height.slider.value(space_height)
  }

  resizeCanvas(windowWidth, windowHeight * 0.9);
  canvas_main_simulation.position(0, windowHeight * 0.05);

  //slider_position_x + windowWidth * 0.5 + 10, slider_position_y - 20

  slider_particle_number.value.text.position(10 + windowWidth * 0.5 + 10, 10 - 20 + windowHeight * 0.05) 
  //particle temperature
  slider_particle_temperature.value.text.position(10 + windowWidth * 0.5 + 10, 30 - 20 + windowHeight * 0.05)
  // Particle mass
  slider_particle_mass.value.text.position(10 + windowWidth * 0.5 + 10, 50 - 20 + windowHeight * 0.05);
  // space dimensions
  slider_width.value.text.position(10 + windowWidth * 0.5 + 10, 70 - 20 + windowHeight * 0.05)
  slider_height.value.text.position(10 + windowWidth * 0.5 + 10, 90 - 20 + windowHeight * 0.05)

  depth_text.text.position(windowWidth * 0.5 + 150, 50 + windowHeight * 0.05)
  // space volume text
  volume_text.text.position(windowWidth * 0.5 + 150, 70 + windowHeight * 0.05)
  // presure
  pressure_text.text.position(30, 100 + windowHeight * 0.05);  
  
  

}
