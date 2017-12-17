module.exports = class{
    constructor(){
        this.rooms = [];
    }

    //Add a room to the rooms
    addRoom(room){
        this.rooms.push(room);
    }

    //Check inside the rooms if there is already a room with the same name
    exists(id){
        for (var i = 0; i < this.rooms.length; i++){
            if (this.rooms[i].id === id){
                return true;
            }
        }
        return false;
    }

    getRoom(id){
        for (var i = 0; i < this.rooms.length; i++){
            if (this.rooms[i].id === id){
                return this.rooms[i];
            }
        }
    }
};
