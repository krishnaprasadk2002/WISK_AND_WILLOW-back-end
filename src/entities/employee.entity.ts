export interface Employee {
    _id: any;
    name: string;
    email: string;
    mobile: string;
    type: string;
    password: string;
    is_employee?: 'Approved' | 'Pending' | 'Rejected';
}

export default Employee
