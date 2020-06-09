import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {BaseService} from '../../../share/base.service';

@Injectable()
export class TestEditService extends BaseService {
  constructor(protected http: Http) {
    super(http);
  }

  requetGetTest(id) {
    return this.requestGet('test/' + id + '?complete=true');
  }

  requestPublishTest(id) {
    const obj: any = {};
    obj.state = 'PUBLISHED';
    const testObj: any = {};
    testObj.test = obj;
    return this.requestPost('test/' + id, testObj);
  }

  requestUpdateTest(test) {
    const obj: any = {};
    const t = Object.assign({}, test);
    delete t.TestId;
    delete t.authorId;
    delete t.toEdit;
    delete t.deleted;
    obj.test = t;
    return this.requestPost('test/' + test.TestId, obj);
  }

  requestNewQuestion(idTest) {
    const obj: any = {};
    obj.TestId = idTest;
    return this.requestPost('question', obj);
  }

  requestQuestionList(TestId) {
    return this.requestGet('question?TestId=' + TestId);
  }

  requestGetQuestion(id) {
    return this.requestGet('question/' + id + '?complete=true');
  }

  requestUpdateConfigQuestion(obj) {
    const t = Object.assign({}, obj);
    delete t.questionId;
    delete t.toEdit;
    delete t.deleted;
    const o: any = {};
    o.question = obj;
    return this.requestPost('question/' + obj.questionId, o);
  }

  deleteQuestion(id) {
    return this.requestDelete('question/' + id);
  }

  orderQuestions(obj) {
    return this.requestPost('sortquestions', obj);
  }
  getTestList() {
    return this.requestGet('testingtool/test?orderby=testName&ordertype=ASC');
  }

  requestImportQuestion(questionId, testId) {
    const o: any = {};
    o.questionId = questionId;
    o.testId = testId;
    return this.requestPost('importQuestion', o);
  }
}
