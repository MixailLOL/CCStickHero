import { _decorator, Component, Node, Button, Lable } from 'cc';
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

    initPos() {
       this.btnStart.node.setPosition(320, 550);
   }

   startPlayPose() {
       this.btnStart.node.setPosition(-1000, -1000);
   }
}


