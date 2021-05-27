import { Component, OnInit } from '@angular/core';
import {Audit} from "../../models/Audit";
import {Topic} from 'src/app/models/Topic';
import {ActivityLog} from "../../models/ActivityLog";
import {Eligibility} from "../../models/Eligibility";
import {QuizService} from "../../services/quiz.service";
import {LoginService} from "../../services/login.service";
import {ActivityLogService} from "../../services/activity-log.service";
import {CookieService} from "angular2-cookie/services/cookies.service";
import {Router} from "@angular/router";
import {AppConst} from "../../constants/app-const";

declare let $: any;

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})
export class TopicsComponent implements OnInit {
  topicList: Topic[] = [];
  topicObj: Topic = new Topic();
  topicEditObj: Topic = new Topic();
  auditObj: Audit = new Audit();
  topicIdDel: number;
  topicTitleDel: string;
  user: any = [];
  message: string;
  updateFlag: boolean;
  Topic
  activeQuizCount: number;
  upcomingQuizCount: number;
  expiredQuizCount: number;
  activeSurveyCount: number;
  upcomingSurveyCount: number;
  showAllMsgFlag = false;
  activityLog: ActivityLog = new ActivityLog();
  quizRvw: number;
  quizInvg: number;

  eligibility: Eligibility = new Eligibility();


  constructor(private quizService: QuizService, private loginService: LoginService, private notificationService: ActivityLogService, private cookieService: CookieService, private router: Router) {

    this.user.username = localStorage.getItem('loginUser');

    this.quizService.getTopicList().subscribe(
        res => {
          console.log(res.json());
          this.topicList = res.json();
        },
        err => {
          console.log(err);
        }
    );

    this.quizService.getEligibility(this.getWithExpiry("userId")).subscribe(
        res => {
          console.log(res.json());
          this.eligibility = res.json();
          this.activeQuizCount = this.eligibility.activeQuizDetailsList.length;
          this.expiredQuizCount = this.eligibility.expiredQuizDetailsList.length;
          this.upcomingQuizCount = this.eligibility.upcomingQuizDetailsList.length;
          this.upcomingSurveyCount = this.eligibility.upcomingSurveyList.length;
          this.activeSurveyCount = this.eligibility.activeSurveyList.length;
        },
        err => {
          console.log(err);
        }
    );

    this.user.username = this.getWithExpiry("username");
    console.log(this.user.username);
    if (this.user.username == null) {

      this.router.navigate(['/login']).then(s => location.reload());
      ;

    }

  }

  setDeleteTopic(id, title) {

    this.topicTitleDel = title;
    this.topicIdDel = id;

  }

  setUpdateCategory(category) {

    console.log(category);
    this.updateFlag = true;
    this.topicEditObj = category;


  }

  getNotification() {
    this.notificationService.getActivityLog().subscribe(
        res => {
          console.log(res.json());
          this.activityLog = res.json();
          this.quizInvg = this.activityLog.invigilatingQuiz.length;
          this.quizRvw = this.activityLog.reviewingQuiz.length;
          localStorage.setItem("rvwCount", this.activityLog.reviewingQuiz.length.toString());
          localStorage.setItem("invgCount", this.activityLog.invigilatingQuiz.length.toString());
          console.log(this.quizInvg, this.quizRvw)
        },
        err => console.log(err)
    );


  }


  deleteCategory() {

    this.quizService.deleteTopic(this.topicIdDel).subscribe(
        res => {
          // console.log(res.json());
          this.message = res.json();

        },
        err => {
          console.log(err._body);
          //  this.cookieService.put("serverEr" ,err._body);
        }
    );
    location.reload();
  }

  getProfileImage() {
    console.log(this.checkImageExists(AppConst.profileServerPath + this.getWithExpiry("userId") + ".png"));

    if (this.checkImageExists(AppConst.profileServerPath + this.getWithExpiry("userId") + ".png")) {
      return AppConst.profileServerPath + this.getWithExpiry("userId") + ".png";
    } else {
      return 'assets/img/boy.png';
    }


  }

  checkImageExists(imageUrl) {

    /**
     * Checking if an image exist in your image folder
     */
    var request = new XMLHttpRequest();
    request.open('GET', imageUrl, false);
    request.send();
    let size: any = request.getAllResponseHeaders().toLowerCase().match(/content-length: \d+/);
    console.log(size);
    if (size.includes('content-length: 0')) {

      return false;
    } else {
      return true;
    }


  }


  showAllMsg() {
    this.showAllMsgFlag = true;
  }

  ngOnInit() {
    console.log(this.cookieService.get("serverEr"));
    this.getNotification();
    console.log(this.getWithExpiry("userId"));
    this.user.id = this.getWithExpiry("userId");

  }


  getWithExpiry(key) {
    const itemStr = localStorage.getItem(key)
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null
    }
    const item = JSON.parse(itemStr);
    const now = new Date()
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key)
      console.log("Session Expired");
      return null
    }
    return item.value;
  }

  buttonInRowClick(event: any): void {
    event.stopPropagation();
    console.log('Button in the row clicked.');
  }

  wholeRowClick(): void {
    console.log('Whole row clicked.');
  }

  nextButtonClickEvent(): void {
    //do next particular records like  101 - 200 rows.
    //we are calling to api

    console.log('next clicked')
  }

  previousButtonClickEvent(): void {
    //do previous particular the records like  0 - 100 rows.
    //we are calling to API
  }

  setAddCategory() {
    this.updateFlag = false;
    this.topicObj.topic_title = null;
    this.topicObj.topic_desc = null;


  }

  logout() {

    this.loginService.logout().subscribe(
        res => {
          location.reload();
        },
        err => console.log(err)
    );
    // location.reload();
    this.router.navigate(['/']).then(s => location.reload());
    ;
  }

  saveTopic() {

    console.log(this.user);
    console.log(this.topicObj);
    console.log(this.getWithExpiry("userId"));
    this.auditObj.user = this.user;
    this.auditObj.audit_event = this.topicObj.topic_title + " audit event";
    this.auditObj.userId = this.getWithExpiry("userId");
    this.topicObj.audit = this.auditObj;
    this.topicEditObj.audit = this.auditObj;
    console.log(this.topicObj);
    console.log("Update Flag: " + this.updateFlag);
    if (this.updateFlag) {

      this.quizService.updateTopic(this.topicEditObj).subscribe(
          res => {
            // console.log(res.json());
            this.topicList = res.json();
            this.updateFlag = false;
            //location.reload();
          },
          err => {
            console.log(err);
          }
      );

    } else {
      this.quizService.saveTopic(this.topicObj).subscribe(
          res => {
            // console.log(res.json());
            this.topicList = res.json();
            location.reload();
          },
          err => {
            console.log(err);
          }
      );

    }
  }

  onSubmit() {

  }

}

