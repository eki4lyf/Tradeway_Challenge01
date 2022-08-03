import {Component, Input, OnInit} from '@angular/core';
import {PrizeView} from "../../models/views/prizeView.model";
import {QuestionService} from "../../services/question.service";
import {Question} from "../../models/question.model";
import {QuestionOption} from "../../models/question_option.model";
import {ModalController} from "@ionic/angular";
import {Result} from "../../models/result.model";
import {NativeStorage} from "@ionic-native/native-storage/ngx";
import {ClaimPrizeService} from "../../services/claim-prize.service";
import {RedeemedPrize} from "../../models/redeemed_prize.model";
import {RedeemedPrizeComponent} from "../redeemed-prize/redeemed-prize.component";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  @Input() prize: PrizeView;
  question: Question;

  constructor(private questionService: QuestionService,
              private modalCtrl: ModalController,
              private localStorage: NativeStorage,
              private claimPrizeService: ClaimPrizeService) { }

  ngOnInit() {
    this.questionService.getQuestion().subscribe((question)=>{
      console.log("Question", question);
      this.question=question;
    });
  }

    answerQuestion(option: QuestionOption) {
    let isCorrect=false;
    const result: Result={
      questionId: this.question.id,
      userId: localStorage.getItem('user')['id'],
      questionOptionId: option.id
    };

    this.claimPrizeService.saveResult(result).subscribe(async (res) => {
      const savedResult = res;
      const correctOption = this.questionService.getCorrectQuestionOptionId(this.question);

      if (correctOption == option.id) {
        isCorrect = true;
        const redeemed: RedeemedPrize =
          {
            userId: localStorage.getItem('user')['id'],
            prizeId: this.prize.id,
            resultId: savedResult.id
          };
        this.claimPrizeService.saveRedeemedPrize(redeemed).subscribe();
      }
      const rPrizeModel = await this.modalCtrl.create({
        component: RedeemedPrizeComponent,
        backdropDismiss: false,
        showBackdrop: true,
        componentProps: {
          questionCorrect: isCorrect,
        },
      });
      return rPrizeModel.present();
    });

  }
}
