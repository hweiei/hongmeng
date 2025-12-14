import promptAction from "@ohos:promptAction";
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
export function showToast(msg: string | Resource) {
    promptAction.showToast({
        message: msg,
        duration: Constants.ANIMATION_DURATION
    });
}
