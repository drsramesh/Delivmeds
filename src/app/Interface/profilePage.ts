import {PharmacyDetails} from '../Interface/pharmacydetails';
import {addUserDetails} from '../Interface/addUserDetails';

export class profilePage {
    id: number;
pharmacyName: string;
  phoneNo: string;
  profileCompleted: boolean;
  pickup: boolean;
  delivery: boolean;
  pharmacyBusinessHours: PharmacyDetails[];
  pharmacyInsuranceProviders: any;
  pharmacyServices: string[];
  pharmacyUsers: string[];  
}