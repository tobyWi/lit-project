export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  location: string;
  phone: string;
}

export interface CvData {
  name: string;
  title: string;
  summary: string;
  contact: ContactInfo;
}
