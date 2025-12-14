import abilityAccessCtrl from "@ohos:abilityAccessCtrl";
import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import type window from "@ohos:window";
import Logger from "@bundle:com.example.newsrelease/entry/ets/common/utils/Logger";
import { GlobalContext } from "@bundle:com.example.newsrelease/entry/ets/viewmodel/GlobalContext";
export default class EntryAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        Logger.info('testTag', '%{public}s', 'Ability onCreate');
        GlobalContext.getContext().setObject('abilityWant', want);
    }
    onDestroy(): void | Promise<void> {
        Logger.info('testTag', '%{public}s', 'Ability onDestroy');
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        // Main window is created, set main page for this ability.
        Logger.info('testTag', '%{public}s', 'Ability onWindowStageCreate');
        this.requestPermissions();
        windowStage.loadContent('pages/MainPage', (err, data) => {
            if (err.code) {
                Logger.error('testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err) ?? '');
                return;
            }
            Logger.info('testTag', 'Succeeded in loading the content. Data: %{public}s', JSON.stringify(data) ?? '');
        });
    }
    onWindowStageDestroy(): void {
        // Main window is destroyed, release UI related resources.
        Logger.info('testTag', '%{public}s', 'Ability onWindowStageDestroy');
    }
    onForeground(): void {
        // Ability has brought to foreground.
        GlobalContext.getContext().setObject('isBackRouter', false);
        Logger.info('testTag', '%{public}s', 'Ability onForeground');
    }
    onBackground(): void {
        // Ability has back to background.
        Logger.info('testTag', '%{public}s', 'Ability onBackground');
    }
    private requestPermissions() {
        let atManager = abilityAccessCtrl.createAtManager();
        atManager.requestPermissionsFromUser(this.context, ['ohos.permission.READ_MEDIA'])
            .then((data) => {
            Logger.info('testTag', '%{public}s', `request permission data result: ${data}`);
        })
            .catch((err: Error) => {
            Logger.error('testTag', '%{public}s', `fail to request permission error:${err}`);
        });
    }
}
