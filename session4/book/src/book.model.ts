export interface BookDto {
    id: string;
    title: string;
    createdDt?: Date;
    updatedDt?: Date;
    author: string;
    isAvailable: boolean;
    // null 값이 될 수 있는 것들은 물음표를 붙여준다.
}