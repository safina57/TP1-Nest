export class CvEvent {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  timestamp: Date;
  userId: string;
  cvId: string;
  createdAt: Date;
}