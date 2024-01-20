class Facturador{
  constructor(vehicle){
    this.vehicle = vehicle;
    this.rate = vehicle.getRate();
  }

  getVehicle() {
    return this.vehicle;
  }

}

class FacturadorHora extends Facturador{
  constructor(vehicle, initialTime, finalTime = null){
    super(vehicle);
    this.initialTime = initialTime;
    this.finalTime = finalTime;
  }

  getTotal(){
    const diffTime = finalTime - initialTime;
    const hours = diffTime / 3.6e6;

    return this.rate * Math.ceil(hours);
  }
}

class Vehicle{
  constructor(rate, vehicleType = null){
    this.rate = rate;
    this.vehicleType = vehicleType;
  }

  getRate(){
    return this.rate;
  }

  setVehicleType(vehicleType){
    this.vehicleType = vehicleType;
  }
}

class Car extends Vehicle{
  constructor(rate = 500){
    super(rate);
  }
}

class Motocycle extends Vehicle{
  constructor(rate = 200){
    super(rate);
  }
}

class InterfaceVehicleType {
  getType(){};
}

class vehicleTypeMotocycle extends InterfaceVehicleType {
  getType(){
    return "Motocycle";
  };
}

class vehicleTypeCar extends InterfaceVehicleType {
  getType(){
    return "Car";
  };
}