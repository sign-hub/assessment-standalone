import {Question} from './question';

export class TestStatus {
  static NEW = 'NEW';
  static DRAFT =  'DRAFT';
  static PUBLISHED = 'PUBLISHED';
}

export class Test {
  TestId: string;
  TestName: string;
  revId: string;
  authorId: string;
  state: TestStatus;
  toEdit: boolean;
  deleted: boolean;
  options: any;
  questions: Array<Question>;
}
