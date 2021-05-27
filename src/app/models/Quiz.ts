
import { Question } from './Question';
import { Topic } from './Topic';
import { QuizSetting } from './QuizSetting';
import { Grade } from './Grade';
import { Audit } from './Audit';
import { Activity } from './Activity';

export class Quiz {
    id: number;
    name: string;
    description: string;
    quizIndex : number ;
    surveyIndex:number;
    randomQuestions:number;

  public quiz_title : string;
  public level : string;
  public introduction_message : string;
  public conclusion_message : string;
  public max_attempt : number;
  public show_answer : boolean =false;
  public show_score : boolean =false;
  answered:boolean =false;
  public time: number;
  public topic: Topic;
 /**  public reviewer : User;
  public invigilator:User; **/
  public assigneeUserIdList: string;
  public assigneeClassList: string;
  public assigneeRoleList: string;
  public questionList: Question[];
  public quizSetting: QuizSetting;
  public blobQuestion: File;
  public status: string;
  public creator: number;
  public passMark: number;
  public scheduleDateTime: string;
  public date_schedule: string;
  public time_schedule: string;
  public activity: Activity;

  public audit: Audit;

   
}
