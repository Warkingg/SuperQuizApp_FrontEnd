import { Topic } from './../models/Topic';
import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AppConst} from '../constants/app-const';
import { Quiz } from '../models/Quiz';
import { Activity } from '../models/Activity';

import {

  HttpRequest, HttpClient,

} from '@angular/common/http';
import { BlobQuestionMap } from '../models/BlobQuestionMap';
import { Question } from '../models/Question';
import { QuizUser } from '../models/QuizUser';
import { Answers } from '../models/Answers';
import { BlobAnswer } from '../models/BlobAnswer';


@Injectable()
export class QuizService {

  constructor(private http: Http , private httpClient: HttpClient) { }

  getActivityList() {
  	const url = AppConst.serverPath + '/quizmaker/activities';

  	const tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem('xAuthToken')
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }

  getEligibility(userId) {

    const url = AppConst.serverPath + '/quizmaker/getQuizEligibility/' + userId;

  	 const tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});
  	 return this.http.get(url, {headers: tokenHeader});


  }

  checkAlreadyGivenQuiz(userId, quizId) {


    const url = AppConst.serverPath + '/quizmaker/getUserQuestionMap/' + userId + '/' + quizId;
    const tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});

    return this.http.get(url, {headers: tokenHeader});
  }


  submitQuiz(quizUser: QuizUser) {

    console.log(quizUser);
    for (const [key, value] of Object.entries(quizUser)) {
      console.log(key + ':' + value);
    }

    console.log(JSON.stringify(quizUser));

    const url = AppConst.serverPath + '/quizmaker/submitQuiz';
    const tokenHeader = new Headers({
      'Content-Type' : 'application/json',
      'x-auth-token' : localStorage.getItem('xAuthToken')
    });
    return this.http.post(url, JSON.stringify(quizUser), {headers: tokenHeader});
  }

  uploadBlobQuestion(blobQuestion: File, quizId: number, type: string) {
    const uploadUrl = 'http://localhost:8181/quizmaker/add/image/' + quizId + '/' + 'question_' + type;

    console.log(blobQuestion);
    const formData = new FormData();
    formData.append('picture', blobQuestion);
    return this.httpClient.post(uploadUrl, formData);

  }

checkSession() {

  const url = AppConst.serverPath + '/checkSession';


  return this.http.get(url);

}

  getQuizList() {
  	const url = AppConst.serverPath + '/quizmaker/quizList';

  	const tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }



  getQuestionBankCount() {
  	const url = AppConst.serverPath + '/quizmaker/getQuestionBankCount';

  	const tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});
  	return this.http.get(url, {headers: tokenHeader});
  }

  saveQuiz(quiz: Quiz) {
    console.log(quiz);
    const url = AppConst.serverPath + '/quizmaker/addQuizIntro';
    const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
    return this.http.post(url, quiz, {headers: tokenHeader});
      }


      saveQuizWithQuestion(quiz: Quiz) {
        console.log(quiz);
        const url = AppConst.serverPath + '/quizmaker/addQuiz';
        const tokenHeader = new Headers({
              'Content-Type' : 'application/json',
              'x-auth-token' : localStorage.getItem('xAuthToken')
            });
        return this.http.post(url, quiz, {headers: tokenHeader});
          }


  addBlobQuestion(quizIndex: number, question: Question, blobObject: BlobQuestionMap[]) {
     let url = '';
     console.log(blobObject, question);
     const formData = new FormData();
     switch (question.question_type) {
      case 'Audio': {
        url = AppConst.serverPath + '/quizmaker/add/audio/' + quizIndex + '/' + question.questionSeq + '_Question_' + question.question_type;
        blobObject.forEach(audioFile => {
            if (audioFile.questionSeq === question.questionSeq ) {
              formData.append('audioQuestion', audioFile.file);

            }
        });

        break;
      }
      case 'Video': {
        url = AppConst.serverPath + '/quizmaker/add/video/' + quizIndex + '/' + question.questionSeq + '_Question_' + question.question_type;
        blobObject.forEach(videoFile => {
          if (videoFile.questionSeq === question.questionSeq ) {
            formData.append('videoQuestion', videoFile.file);

          }
      });

      //  formData.append("videoQuestion", blobObject[question.questionSeq-1].file);
        break;
      }
      case 'Image': {
        url = AppConst.serverPath + '/quizmaker/add/image/' + quizIndex + '/' + question.questionSeq + '_Question_' + question.question_type;

        blobObject.forEach(imageFile => {
          if (imageFile.questionSeq === question.questionSeq ) {
            formData.append('picture', imageFile.file);

          }
      });

        // formData.append("picture", blobObject[question.questionSeq-1].file);
        break;
      }
      default: {
         // statements;
         break;
      }
   }


     return this.httpClient.post(url, formData);

  }

  addBlobAnswer(quiz: Quiz, response: Answers, question: Question, blobAnswerSet: BlobAnswer[]) {
    let url = '';   const formData = new FormData();
    console.log(response, blobAnswerSet);

    blobAnswerSet.forEach(blobAns => {

      if (blobAns.questionSeq === question.questionSeq) {
        url = AppConst.serverPath + '/quizmaker/add/image/' + quiz.quizIndex + '/' + question.questionSeq + '_' + response.responseSeq + '_Answer_Image.png';
        blobAns.answerBlob.forEach(uploadBlobAns => {
            if ((uploadBlobAns.responseSeq + 1) === response.responseSeq ) {
              console.log(uploadBlobAns.file);
              formData.append('picture', uploadBlobAns.file);
            }
        });


      }



    });
    return this.httpClient.post(url, formData);

 }


  saveActivity(activity: Activity) {
console.log(JSON.stringify(activity));
const url = AppConst.serverPath + '/quizmaker/addActivity';
const tokenHeader = new Headers({
  		'Content-Type' : 'application/json',
  		'x-auth-token' : localStorage.getItem('xAuthToken')
  	});
return this.http.post(url, JSON.stringify(activity), {headers: tokenHeader});
  }

  updateActivity(updateActivity: Activity) {
    console.log(updateActivity);
    const url = AppConst.serverPath + '/quizmaker/updateActivity';
    const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
    return this.http.post(url, JSON.stringify(updateActivity), {headers: tokenHeader});
      }

  deleteActivity(activityId: number) {
    console.log(activityId);
    const url = AppConst.serverPath + '/quizmaker/deleteActivity/' + activityId;
    const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
    return this.http.get(url,  {headers: tokenHeader});
      }

      deleteQuiz(quizId: number) {
        console.log(quizId);
        const url = AppConst.serverPath + '/quizmaker/deleteQuiz/' + quizId;
        const tokenHeader = new Headers({
              'Content-Type' : 'application/json',
              'x-auth-token' : localStorage.getItem('xAuthToken')
            });
        return this.http.get(url,  {headers: tokenHeader});
          }

          deleteSurvey(surveyId: number) {
            console.log(surveyId);
            const url = AppConst.serverPath + '/quizmaker/deleteSurvey/' + surveyId;
            const tokenHeader = new Headers({
                  'Content-Type' : 'application/json',
                  'x-auth-token' : localStorage.getItem('xAuthToken')
                });
            return this.http.get(url,  {headers: tokenHeader});
              }

      getQuizResultByUser(userid) {
        const url = AppConst.serverPath + '/quizmaker/getResultByUserId/' + userid;

        const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getQuizByIndex(quizIndex) {
        const url = AppConst.serverPath + '/quizmaker/getQuizByIndex/' + quizIndex;

        const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getSurveyByIndex(surveyIndex) {
        const url = AppConst.serverPath + '/quizmaker/getSurveyByIndex/' + surveyIndex;

        const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getSurveyParticipation(userId , surveyIndex) {
        const url = AppConst.serverPath + '/quizmaker/getSurveyParticipated/' + userId + '/' + surveyIndex;

        const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getQuizMaxAttempt(userId, quizIndex) {
        const url = AppConst.serverPath + '/quizmaker/getQuizEligibility/' + userId + '/' + quizIndex;

        const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
        return this.http.get(url, {headers: tokenHeader});
      }


      getTopicList() {
        const url = AppConst.serverPath + '/quizmaker/topics';

        const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
        return this.http.get(url, {headers: tokenHeader});
      }


      getQuizByTopic(topicId) {
        const url = AppConst.serverPath + '/quizmaker/getQuizUserByTopic/' + topicId;

        const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getResultByTopic(topicId: number) {
        const url = AppConst.serverPath + '/quizmaker/getResultByTopic/' + topicId;

        const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
        return this.http.get(url, {headers: tokenHeader});
      }


      getResultByQuiz(quizId: number) {
        const url = AppConst.serverPath + '/quizmaker/getResultByQuizId/' + quizId;

        const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getStatewiseResultByTopic(topicId: number) {
        const url = AppConst.serverPath + '/quizmaker/getStatewiseResultByTopic/' + topicId;

        const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getCityWiseResultByQuizId(quizid, state) {

        const url = AppConst.serverPath + '/quizmaker/getCityWiseResult/' + quizid + '/' + state;

        const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
        return this.http.get(url, {headers: tokenHeader});



      }
      getCityWiseResultAll(state) {

        const url = AppConst.serverPath + '/quizmaker/getCitywiseResult/' + state;

        const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
        return this.http.get(url, {headers: tokenHeader});



      }


      getAllQuizResult() {
        const url = AppConst.serverPath + '/quizmaker/getAllResult';

        const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      getStateWiseQuizResult() {
        const url = AppConst.serverPath + '/quizmaker/getStatewiseResult';

        const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
        return this.http.get(url, {headers: tokenHeader});
      }

      saveTopic(topic: Topic) {
    console.log(JSON.stringify(topic));
    const url = AppConst.serverPath + '/quizmaker/addTopic';
    const tokenHeader = new Headers({
          'Content-Type' : 'application/json',
          'x-auth-token' : localStorage.getItem('xAuthToken')
        });
    return this.http.post(url, JSON.stringify(topic), {headers: tokenHeader});
      }

      updateTopic(updateTopic: Topic) {
        console.log(updateTopic);
        const url = AppConst.serverPath + '/quizmaker/updateTopic';
        const tokenHeader = new Headers({
              'Content-Type' : 'application/json',
              'x-auth-token' : localStorage.getItem('xAuthToken')
            });
        return this.http.post(url, JSON.stringify(updateTopic), {headers: tokenHeader});
          }

      deleteTopic(topicId: number) {
        console.log(topicId);
        const url = AppConst.serverPath + '/quizmaker/deleteTopic/' + topicId;
        const tokenHeader = new Headers({
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('xAuthToken')
        });
        return this.http.get(url, {headers: tokenHeader});
      }


  get(url: string) {
    return this.httpClient.get(url);
  }

  getAll() {
    return [
      { id: 'assets/data/javascript.json', name: 'JavaScript' },
      { id: 'assets/data/aspnet.json', name: 'Asp.Net' },
      { id: 'assets/data/csharp.json', name: 'C Sharp' },
      { id: 'assets/data/designPatterns.json', name: 'Design Patterns' },
      { id: 'assets/data/bollywoodQuiz.json', name: 'BollyWood Quiz' },
      { id: 'assets/data/bollywood90s.json', name: 'BollyWood Quiz 90s' }
    ];
  }

}
