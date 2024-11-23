import { _decorator, Component, Node, Button,view, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UserInt')
export class UserInt extends Component {
    @property({
        type: Button,
        tooltip: "START",
    })
    public btnStart: Button;

    @property({
        type: Button,
        tooltip: "RETRY",
    })
    public btnRetry: Button;

    @property({
        type: Node,
        tooltip: "score",
    })
    public score: Node;

    @property({
        type: Node,
        tooltip: "Game over",
    })
    public gameOver: Node;

    @property({
        type: Node,
        tooltip: "Best score",
    })
    public bestScore: Node;


    stateInitF() {
        this.score.getComponent(Label).string = Global.score;
        this.score.setPosition(view.getVisibleSize().width/2, view.getVisibleSize().height*0.85);     
        this.bestScore.getComponent(Label).string = Global.bestScore; 
        this.btnStart.node.setPosition(view.getVisibleSize().width/2, view.getVisibleSize().height/2);
        this.gameOver.setPosition(view.getVisibleSize().width*2, view.getVisibleSize().height*2);
        this.btnRetry.node.setPosition(view.getVisibleSize().width*2, view.getVisibleSize().height*2);
        this.score.setPosition(view.getVisibleSize().width/2, view.getVisibleSize().height*0.85);     
        this.bestScore.setPosition(view.getVisibleSize().width*(3/4), view.getVisibleSize().height*0.9);
   }

   stateLooseF(){
        this.gameOver.setPosition(view.getVisibleSize().width/2, view.getVisibleSize().height*0.8);
        this.btnRetry.node.setPosition(view.getVisibleSize().width/2, view.getVisibleSize().height*0.4);
        this.bestScore.getComponent(Label).string = Global.bestScore;
   }

   startPlayPose() {
       this.btnStart.node.setPosition(-1000, -1000);
   }

   updateScore(){
        this.score.getComponent(Label).string = Global.score;
   }
}


