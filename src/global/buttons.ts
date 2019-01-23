/**
 * This file is part of the vscode-powertools distribution.
 * Copyright (c) e.GO Digital GmbH, Aachen, Germany (https://www.e-go-digital.com/)
 *
 * vscode-powertools is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * vscode-powertools is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import * as _ from 'lodash';
import * as ego_contracts from '../contracts';
import * as ego_global_values from '../global/values';
import * as ego_helpers from '../helpers';
import * as ego_log from '../log';
import * as ego_pt from '../extension';
import * as vscode from 'vscode';


const GLOBAL_BUTTONS: ego_contracts.GlobalButton[] = [];
let nextButtonCommandId = Number.MIN_SAFE_INTEGER;


/**
 * Disposes all global buttons.
 */
export function disposeGlobalUserButtons() {
    while (GLOBAL_BUTTONS.length > 0) {
        ego_helpers.tryDispose(
            GLOBAL_BUTTONS.pop()
        );
    }
}

/**
 * Reloads all global buttons.
 */
export async function reloadGlobalUserButtons() {
    const SETTINGS: ego_contracts.GlobalExtensionSettings = this;

    disposeGlobalUserButtons.apply(
        this
    );

    const BUTTONS = ego_helpers.asArray(SETTINGS.buttons);
    if (BUTTONS.length < 1) {
        return;
    }

    BUTTONS.forEach(b => {
        try {
            if (!ego_helpers.doesMatchPlatformCondition(b)) {
                return;
            }
            if (!ego_helpers.doesMatchFilterCondition(b)) {
                return;
            }

            let newButton: vscode.StatusBarItem;
            let newCommand: vscode.Disposable;
            let hasBeenDisposed = false;
            const DISPOSE_BTN = () => {
                if (hasBeenDisposed) {
                    return;
                }
                hasBeenDisposed = true;

                ego_helpers.tryDispose(newButton);
                ego_helpers.tryDispose(newCommand);
            };

            try {
                let commandAction: Function;

                let btnAction: ego_contracts.ButtonAction;
                if (_.isObjectLike(b.action)) {
                    btnAction = <ego_contracts.ButtonAction>b.action;
                } else {
                    btnAction = <ego_contracts.ShellCommandButtonAction>{
                        command: ego_helpers.toStringSafe(btnAction),
                    };
                }

                switch (ego_helpers.normalizeString(btnAction.type)) {
                    case '':
                    case 'shell':
                        {
                            commandAction = async () => {
                                await ego_pt.runShellCommand(
                                    <ego_contracts.ShellCommandButtonAction>btnAction
                                );
                            };
                        }
                        break;

                    case 'script':
                        {
                            commandAction = async () => {
                                await ego_pt.executeScript<ego_contracts.ButtonActionScriptArguments>(
                                    <ego_contracts.ScriptButtonAction>btnAction,
                                    (args) => {
                                        // ARGS.button
                                        Object.defineProperty(args, 'button', {
                                            enumerable: true,
                                            get: () => {
                                                return newButton;
                                            }
                                        });

                                        return args;
                                    },
                                );
                            };
                        }
                        break;
                }

                if (commandAction) {
                    const ID = nextButtonCommandId++;
                    const CMD_ID = `ego.power-tools.globalButtons.btn${ ID }`;

                    newCommand = vscode.commands.registerCommand(CMD_ID, async () => {
                        try {
                            newButton.command = undefined;

                            return await Promise.resolve(
                                commandAction()
                            );
                        } catch (e) {
                            ego_log.CONSOLE
                                   .trace(e, 'global.buttons.reloadGlobalUserButtons(2)');

                            ego_helpers.showErrorMessage(
                                `Could not execute button: ${ ego_helpers.errorToString(e) }`
                            );
                        } finally {
                            newButton.command = CMD_ID;
                        }
                    });

                    newButton = ego_helpers.buildButtonSync(b, (newBtn) => {
                        newBtn.text = ego_global_values.replaceValues(newBtn.text);
                        newBtn.tooltip = ego_global_values.replaceValues(newBtn.tooltip);
                        newBtn.color = ego_global_values.replaceValues(newBtn.color);
                        newBtn.command = CMD_ID;
                    });

                    GLOBAL_BUTTONS.push({
                        dispose: () => {
                            DISPOSE_BTN();

                            if (!_.isNil(b.onDestroyed)) {
                                ego_pt.executeCode(
                                    b.onDestroyed
                                );
                            }
                        }
                    });

                    if (!_.isNil(b.onCreated)) {
                        ego_pt.executeCode(
                            b.onCreated
                        );
                    }

                    newButton.show();
                }
            } catch (e) {
                DISPOSE_BTN();

                throw e;
            }
        } catch (e) {
            ego_log.CONSOLE
                   .trace(e, 'global.buttons.reloadGlobalUserButtons(1)');
        }
    });
}
