export class TechDto {
    
    id;
    name;
    prereqs = [];
       
    constructor(id) {
        this.id = id;
    }
    
}