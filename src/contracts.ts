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

import * as ego_helpers from './helpers';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as vscode from 'vscode';


/**
 * A message item for a popup with an action.
 */
export interface ActionMessageItem extends vscode.MessageItem {
    /**
     * The (optional) action to invoke.
     */
    action?: () => any;
}

/**
 * A quick pick item with an action.
 */
export interface ActionQuickPickItem<TTag = any> extends vscode.QuickPickItem {
    /**
     * The (optional) action to invoke.
     */
    action?: Function;
    /**
     * Something that should be linked with that item.
     */
    tag?: TTag;
}

/**
 * An app entry.
 */
export type AppEntry = AppItem | string;

/**
 * An event function for an app.
 *
 * @param {AppEventScriptArguments} args The arguments.
 *
 * @return {TResult} The result.
 */
export type AppEventFunction<TResult = any> = (args: AppEventScriptArguments) => TResult;

/**
 * Arguments for an app script event.
 */
export interface AppEventScriptArguments<TData = any> extends ScriptArguments {
    /**
     * The underlying button (if available).
     */
    readonly button?: vscode.StatusBarItem;
    /**
     * Clears the '.temp' sub folder.
     *
     * @return {boolean} Temp folder has been cleared or not.
     */
    readonly clearTemp: () => boolean;
    /**
     * The data.
     */
    readonly data?: TData;
    /**
     * The name of the event.
     */
    readonly event: string;
    /**
     * Checks if a file or folder exists, relative to '.data' sub folder.
     *
     * @param {string} path The path of the file / folder to check.
     *
     * @return {boolean} Indicates if file / folder exists or not.
     */
    readonly exists: (path: string) => boolean;
    /**
     * The underlying extension context.
     */
    readonly extension: vscode.ExtensionContext;
    /**
     * Returns the list of all workspaces.
     *
     * @return {WorkspaceInfo[]} The list of workspaces.
     */
    readonly getAllWorkspaces: () => WorkspaceInfo[];
    /**
     * Returns an URI from the 'resources' directory.
     *
     * @param {string} path The (relative) path.
     * @param {boolean} [asString] Return as string or object. Default: (true)
     *
     * @return {vscode.Uri} The URI.
     */
    readonly getFileResourceUri: (path: string, asString?: boolean) => vscode.Uri | string;
    /**
     * Posts a command to the web view.
     *
     * @param {string} command The name of the command.
     * @param {any} [data] The data for the command.
     *
     * @return {Promise<boolean>} A promise that indicates if operation was successful or not.
     */
    readonly post: (command: string, data?: any) => Promise<boolean>;
    /**
     * Reads a file, relative to '.data' sub folder.
     *
     * @param {string} path The path of the file.
     *
     * @return {Buffer} The read data.
     */
    readonly readFile: (path: string) => Buffer;
    /**
     * Reads a file or folder, relative to '.data' sub folder.
     *
     * @param {string} path The path of the file / folder.
     */
    readonly remove: (path: string) => void;
    /**
     * Renders an 'ejs' template.
     *
     * @param {string} source The (template) source.
     * @param {ejs.Data} [data] The data for the template.
     *
     * @return string The rendered template.
     */
    readonly render: (source: string, data?: ejs.Data) => string;
    /**
     * Renders an 'ejs' template from a file.
     *
     * @param {string} file The path to the file with the (template) source.
     * @param {ejs.Data} [data] The data for the template.
     *
     * @return string The rendered template.
     */
    readonly renderFile: (file: string, data?: ejs.Data) => string;
    /**
     * Returns file system information of a file or folder, relative to the '.data' sub folder.
     *
     * @param {string} path The path of the item.
     * @param {boolean} [lstat] Use 'fs.lstat()' instead of 'fs.stat()'. Default: (true)
     *
     * @return {fs.Stats|false} The information or (false) if not found.
     */
    readonly stat: (path: string, lstat?: boolean) => fs.Stats | false;
    /**
     * Creates a new temp file, inside the '.temp' sub folder.
     *
     * @return {string} The full path of the new file.
     */
    readonly tempFile: () => string;
    /**
     * Returns a full path, relative to the '.data' sub folder.
     *
     * @param {string} path The input path.
     *
     * @return {string} The full path.
     */
    readonly toDataPath: (path: string) => string;
    /**
     * The list of workspaces, grouped by name.
     */
    readonly workspaces: WorkspaceList;
    /**
     * Write data to a file, relative to '.data' sub folder.
     *
     * @param {string} path The path of the file.
     * @param {any} data The data write.
     */
    readonly writeFile: (path: string, data: any) => void;
}

/**
 * An app item.
 */
export interface AppItem extends CanImportValues, Conditional, ForPlatforms, WithCreationEvents, WithScript {
    /**
     * An optional button to define.
     */
    button?: Button;
    /**
     * A description for the app.
     */
    description?: string;
    /**
     * The (display) name.
     */
    name?: string;
}

/**
 * An app module.
 */
export interface AppModule {
    /**
     * Returns the HTML content for the app.
     *
     * @param {AppEventScriptArguments} args Arguments for the event.
     *
     * @return {string} The HTML (body) content.
     */
    readonly getHtml: (args: AppEventScriptArguments) => string;
    /**
     * Returns the title of the app (view).
     *
     * @param {AppEventScriptArguments} args Arguments for the event.
     *
     * @return {string} The title.
     */
    readonly getTitle: (args: AppEventScriptArguments) => string;
    /**
     * Is invoked, when the web view gets to be closed.
     *
     * @param {AppEventScriptArguments} args Arguments for the event.
     */
    readonly onClose?: (args: AppEventScriptArguments) => any;
    /**
     * Is invoked, when the web view is going to be disposed.
     *
     * @param {AppEventScriptArguments} args Arguments for the event.
     */
    readonly onDispose?: (args: AppEventScriptArguments) => any;
    /**
     * Is invoked, when the web view has been disposed.
     *
     * @param {AppEventScriptArguments} args Arguments for the event.
     */
    readonly onDisposed?: (args: AppEventScriptArguments) => any;
    /**
     * Is invoked on an app event.
     *
     * @param {AppEventScriptArguments} args Arguments for the event.
     */
    readonly onEvent?: (args: AppEventScriptArguments) => any;
    /**
     * Is invoked after the web view has been gone to the background.
     *
     * @param {AppEventScriptArguments} args Arguments for the event.
     */
    readonly onHidden?: (args: AppEventScriptArguments) => any;
    /**
     * Is invoked after web page inside view has been loaded.
     *
     * @param {AppEventScriptArguments} args Arguments for the event.
     */
    readonly onLoaded?: (args: AppEventScriptArguments) => any;
    /**
     * Is invoked when a message received from the web view.
     */
    readonly onMessage?: (args: AppEventScriptArguments) => any;
    /**
     * Is invoked after the web view has became visible again.
     *
     * @param {AppEventScriptArguments} args Arguments for the event.
     */
    readonly onShown?: (args: AppEventScriptArguments) => any;
}

/**
 * The 'package.json' file of an app.
 */
export interface AppPackageJSON {
    /**
     * Information about the author.
     */
    author?: {
        /**
         * The email address.
         */
        email?: string;
        /**
         * The name.
         */
        name?: string;
        /**
         * The (homepage) URL.
         */
        url?: string;
    };
    /**
     * A list of one or more dependencies.
     */
    dependencies?: { [module: string]: string };
    /**
     * A list of one or more dev dependencies.
     */
    devDependencies?: { [module: string]: string };
    /**
     * The description.
     */
    description?: string;
    /**
     * The display name.
     */
    displayName?: string;
    /**
     * The software license (ID).
     */
    license?: string;
    /**
     * The (internal) name.
     */
    name?: string;
    /**
     * Options for the script.
     */
    options?: { [key: string]: any };
    /**
     * The version number.
     */
    version?: string;
}

/**
 * Describes an app store.
 */
export interface AppStore {
    /**
     * One or more app entries.
     */
    apps: AppStoreApp[];
    /**
     * A list of external app stores.
     */
    imports?: string | string[];
    /**
     * The name of the store.
     */
    name: string;
}

/**
 * An app entry in an spp atore.
 */
export interface AppStoreApp {
    /**
     * [INTERNAL] Source of the app.
     */
    __source: AppStoreAppSource;
    /**
     * A description of the app.
     */
    description?: string;
    /**
     * The display name of the app.
     */
    displayName?: string;
    /**
     * URL to an app icon.
     */
    icon?: string;
    /**
     * The name of the app.
     */
    name: string;
    /**
     * The source, where the package can downloaded.
     */
    source: string;
}

/**
 * Source information of an app store app.
 */
export interface AppStoreAppSource {
    /**
     * The underlying app.
     */
    app: AppStoreApp;
    /**
     * The underlying store.
     */
    store: AppStore;
    /**
     * The URL to the store.
     */
    url: string;
}

/**
 * Azure DevOps API credentials.
 */
export interface AzureDevOpsAPICredentials {
    /**
     * The name of the organization.
     */
    readonly organization: string;
    /**
     * The personal access token.
     */
    readonly pat: string;
    /**
     * Creates a Base64 string for 'Authorization' HTTP header, e.g.
     */
    readonly toBase64: () => string;
    /**
     * The username / email
     */
    readonly username: string;
}

/**
 * A boxed value.
 */
export interface BoxedValue<TValue = any> {
    /**
     * The boxed value.
     */
    value?: TValue;
}

/**
 * Settings for a button in the status bar.
 */
export interface Button {
    /**
     * The color.
     */
    color?: string;
    /**
     * Display button on the right side or not.
     */
    isRight?: boolean;
    /**
     * The priority.
     */
    priority?: number;
    /**
     * The label / text.
     */
    text?: string;
    /**
     * The tooltip.
     */
    tooltip?: string;
}

/**
 * A button action.
 */
export interface ButtonAction {
    /**
     * The type.
     */
    type?: string;
}

/**
 * A module for a script based button action.
 */
export interface ButtonActionScriptModule extends ScriptModule<ButtonActionScriptArguments> {
}

/**
 * Arguments for a script based button action.
 */
export interface ButtonActionScriptArguments extends WorkspaceScriptArguments {
    /**
     * The underlying button instance.
     */
    readonly button: vscode.StatusBarItem;
}

/**
 * A possible value for a button entry in the settings.
 */
export type ButtonEntry = ButtonItem;

/**
 * A button item in the settings.
 */
export interface ButtonItem extends Button, CanImportValues, Conditional, ConditionalForActiveEditor, ForPlatforms, WithCreationEvents, WithEditorChangedEvents {
    /**
     * The action to invoke, when clicked.
     */
    action: string | ButtonAction;
}

/**
 * An "import value" entry.
 */
export type CanImportValueEntry = string;

/**
 * An object, which can import property data from values.
 */
export interface CanImportValues {
    /**
     * Defines a list of properties, which uses (external) values for itself.
     */
    importValues?: { [propertyName: string]: CanImportValueEntry };
}

/**
 * A button for use in code.
 */
export interface CodeButton {
    /**
     * Gets or sets the color.
     */
    color: string;
    /**
     * Disables the button.
     */
    readonly disable: () => void;
    /**
     * Enables the button.
     */
    readonly enable: () => void;
    /**
     * Hides the button.
     */
    readonly hide: () => void;
    /**
     * Shows the button.
     */
    readonly show: () => void;
    /**
     * Gets or sets the text.
     */
    text: string;
    /**
     * Gets or sets the tooltip.
     */
    tooltip: string;
    /**
     * Updates the button.
     */
    readonly update: () => void;
}

/**
 * A value item running (JavaScript) code.
 */
export interface CodeValueItem extends ValueItem {
    /**
     * The code to execute.
     */
    code: string;
}

/**
 * A button for an command.
 */
export interface CommandButton extends Button, ConditionalForActiveEditor, WithEditorChangedEvents {
}

/**
 * A button action based on a command.
 */
export interface CommandButtonAction extends ButtonAction {
    /**
     * One or more arguments to pass.
     */
    arguments?: any[];
    /**
     * The ID of the command.
     */
    command: string;
}

/**
 * A possible value for a command entry.
 */
export type CommandEntry = CommandItem;

/**
 * The execution context of a command.
 */
export interface CommandExecutionContext {
    /**
     * The data.
     */
    readonly data?: KeyValuePairs;
    /**
     * The source.
     */
    readonly source?: CommandExecutionSource;
}

/**
 * List of command execution sources.
 */
export enum CommandExecutionSource {
    /**
     * For a file.
     */
    File,
    /**
     * For a folder.
     */
    Folder,
}

/**
 * A command item.
 */
export interface CommandItem extends CanImportValues, Conditional, ForPlatforms, WithCreationEvents, WithScript {
    /**
     * Settings for an optional button.
     */
    button?: CommandButton;
    /**
     * A description for the command.
     */
    description?: string;
    /**
     * Indicates if that command can be executed for a current or selected file or not.
     */
    forFile?: boolean;
    /**
     * Indicates if that command can be executed for a current or selected folder or not.
     */
    forFolder?: boolean;
    /**
     * The name for display.
     */
    name?: string;
}

/**
 * An item that uses optional JavaScript code, to check if it is available or not.
 */
export interface Conditional {
    /**
     * The JavaScript code that checks the avaibility.
     */
    'if'?: string;
}

/**
 * An object, which can check if it should be visible for an active editor.
 */
export interface ConditionalForActiveEditor {
    /**
     * The regular expression, that checks if an object should be visible for an active editor or not.
     */
    ifFile?: string;
}

/**
 * A button for a cron jon.
 */
export interface CronJobButton extends Button {
}

/**
 * A cron job.
 */
export interface CronJobItem extends JobItem {
    /**
     * Run on startup or not.
     */
    autoStart?: boolean;
    /**
     * On optional button to define.
     */
    button?: CronJobButton;
    /**
     * The format of the value in 'time'.
     */
    format?: string;
    /**
     * The pattern.
     */
    time?: string;
}

/**
 * An action for an event that is raised, after a document has been opened.
 */
export interface DocumentOpenedEventItem extends FileEventItem {
}

/**
 * Arguments for script that is executed on a file / folder change.
 */
export interface DocumentOpenedEventActionScriptArguments extends WorkspaceScriptArguments {
    /**
     * The underlying document.
     */
    readonly document: vscode.TextDocument;
    /**
     * Short form of 'document.uri'
     */
    readonly file: vscode.Uri;
}

/**
 * An event action.
 */
export interface EventAction {
    /**
     * The type.
     */
    type?: string;
}

/**
 * A possible value for an event entry.
 */
export type EventEntry = EventItem;

/**
 * An event item.
 */
export interface EventItem extends CanImportValues, Conditional, ForPlatforms, WithCreationEvents {
    /**
     * The action.
     */
    action: EventAction;
    /**
     * The event type.
     */
    type?: string;
}

/**
 * Extension configuration.
 */
export interface ExtensionConfiguration extends WithValues {
    /**
     * One or more apps to register.
     */
    apps?: AppEntry[];
    /**
     * One or more buttons to register.
     */
    buttons?: ButtonEntry[];
    /**
     * One or more commands to register.
     */
    commands?: { [id: string]: CommandEntry };
    /**
     * One or more events to register.
     */
    events?: EventEntry[];
    /**
     * Global data.
     */
    globals?: any;
    /**
     * A list of one or more external setting files to import.
     */
    imports?: string | string[];
    /**
     * One or more jobs to run.
     */
    jobs?: JobEntry[];
    /**
     * Runs 'npm install' if a 'package.json' file exists, but no 'node_modules' has been found.
     */
    runNPMInstall?: boolean;
    /**
     * One or more things to run at startup.
     */
    startup?: StartupEntry[];
}

/**
 * A function that provides the/an extension context.
 */
export type ExtensionContextProvider = () => vscode.ExtensionContext;

/**
 * Arguments for script that is executed on a file / folder change.
 */
export interface FileChangeEventActionScriptArguments extends WorkspaceScriptArguments {
    /**
     * The type of change.
     */
    readonly changeType: FileChangeType;
    /**
     * The underlying document (if available).
     */
    readonly document: vscode.TextDocument;
    /**
     * The changed file / folder.
     */
    readonly file: vscode.Uri;
}

/**
 * A script module that is executed on a file / folder change.
 */
export interface FileChangeEventActionScriptModule extends ScriptModule<FileChangeEventActionScriptArguments> {
}

/**
 * An action for a file / folder based event.
 */
export interface FileEventItem extends EventItem {
    /**
     * One or more glob patterns that describe, what files should be EXCLUDED.
     */
    exclude?: string[];
    /**
     * One or more glob patterns that describe, what files should be INCLUDED.
     */
    files?: string[];
}

/**
 * Arguments for script that is executed when a file has been saved.
 */
export interface FileSavedEventActionScriptArguments extends FileChangeEventActionScriptArguments {
}

/**
 * A script module that is executed when a file has been saved.
 */
export interface FileSavedEventActionScriptModule extends ScriptModule<FileSavedEventActionScriptArguments> {
}

/**
 * A storage with states, based on file paths.
 */
export type FileStateStorage = { [file: string]: GetterAndSetter };

/**
 * A file value item.
 */
export interface FileValueItem extends ValueItem {
    /**
     * The path to the file that should be loaded.
     */
    file: any;
    /**
     * The target (data) format to use.
     */
    format?: string;
}

/**
 * Arguments for script that is executed when a file is going to be saved.
 */
export interface FileWillSaveEventActionScriptArguments extends FileChangeEventActionScriptArguments {
    /**
     * The reason.
     */
    readonly reason: vscode.TextDocumentSaveReason;
}

/**
 * An object for specific platforms.
 */
export interface ForPlatforms {
    /**
     * One or more platform names, the object is for.
     */
    platforms?: string[];
}

/**
 * Stores geo coordinates.
 */
export interface GeoCoordinates {
    /**
     * The latitude.
     */
    lat: number;
    /**
     * The longitude.
     */
    lng: number;
}

/**
 * An object that gets a value.
 */
export interface Getter {
    /**
     * Gets a value.
     *
     * @return {any} The (current) value.
     */
    readonly get: () => any;
}

/**
 * An object that gets and sets a value.
 */
export interface GetterAndSetter extends Getter, Setter {
}

/**
 * A global button.
 */
export interface GlobalButton extends vscode.Disposable {
}

/**
 * A global command.
 */
export interface GlobalCommand extends vscode.Disposable {
    /**
     * The optional button.
     */
    readonly button?: vscode.StatusBarItem;
    /**
     * The command instance.
     */
    readonly command: vscode.Disposable;
    /**
     * A description of the command.
     */
    readonly description: string;
    /**
     * Executes the command.
     *
     * @param {CommandExecutionContext} context The execution context.
     * @param {any[]} [args] One or more argument for the execution.
     *
     * @return {any} The result of the execution.
     */
    readonly execute: (context: CommandExecutionContext, ...args: any[]) => any;
    /**
     * The ID of the command.
     */
    readonly id: string;
    /**
     * The item from the settings.
     */
    readonly item: CommandItem;
    /**
     * The name for display.
     */
    readonly name: string;
}

/**
 * Arguments for a global command script.
 */
export interface GlobalCommandScriptArguments extends WorkspaceScriptArguments {
    /**
     * The argument that have been submitted to the command.
     */
    readonly arguments: any[];
    /**
     * The ID of the command.
     */
    readonly command: string;
    /**
     * The source.
     */
    readonly source: CommandExecutionSource;
}

/**
 * Arguments for a global command, which is executed for an active or selected file.
 */
export interface GlobalCommandScriptArgumentsForFiles extends GlobalCommandScriptArguments {
    /**
     * The underlying file.
     */
    readonly file: vscode.Uri;
}

/**
 * Arguments for a global command, which is executed for an active or selected folder.
 */
export interface GlobalCommandScriptArgumentsForFolders extends GlobalCommandScriptArguments {
    /**
     * The underlying folder.
     */
    readonly folder: vscode.Uri;
}

/**
 * Global extension settings.
 */
export interface GlobalExtensionSettings extends WithValues {
    /**
     * One or more buttons to register.
     */
    buttons?: ButtonEntry[];
    /**
     * One or more commands to register.
     */
    commands?: { [id: string]: CommandEntry };
    /**
     * Global data.
     */
    globals?: any;
    /**
     * One or more jobs to run.
     */
    jobs?: JobEntry[];
}

/**
 * A global job.
 */
export interface GlobalJob extends vscode.Disposable {
    /**
     * A description for the job.
     */
    readonly description: string;
    /**
     * Gets if the job is currently running or not.
     */
    readonly isRunning: boolean;
    /**
     * The (display) name.
     */
    readonly name: string;
    /**
     * Starts the job.
     *
     * @return {boolean} Operation was successful or not.
     */
    readonly start: () => boolean;
    /**
     * Stops the job.
     *
     * @return {boolean} Operation was successful or not.
     */
    readonly stop: () => boolean;
}

/**
 * An installed app.
 */
export interface InstalledApp {
    /**
     * Tries to load the icon file of the app.
     *
     * @return {Promise<string|false>} The promise with the data URI or (false) if it does not exist.
     */
    readonly loadIcon: () => Promise<string | false>;
    /**
     * Tries to load the '.egoignore' file of the app.
     *
     * @return {Promise<string|false>} The promise with the entries or (false) if it does not exist.
     */
    readonly loadIgnoreFile: () => Promise<string[] | false>;
    /**
     * Tries to load the 'package.json' file of the app.
     *
     * @return {Promise<AppPackageJSON|false>} The promise with the data or (false) if it does not exist.
     */
    readonly loadPackageJSON: () => Promise<AppPackageJSON | false>;
    /**
     * Tries to load the 'README.md' file of the app.
     *
     * @return {Promise<string|false>} The promise with the content or (false) if it does not exist.
     */
    readonly loadREADME: () => Promise<string | false>;
    /**
     * The directory, where the app is installed.
     */
    readonly path: string;
}

/**
 * A possible value for a job entry.
 */
export type JobEntry = JobItem;

/**
 * A job item.
 */
export interface JobItem extends CanImportValues, Conditional, ForPlatforms, WithCreationEvents {
    /**
     * The action to invoke.
     */
    action: string | JobItemAction;
    /**
     * A description for the job.
     */
    description?: string;
    /**
     * A (display) name.
     */
    name?: string;
    /**
     * The type of the job item.
     */
    type?: string;
}

/**
 * A job item action.
 */
export interface JobItemAction {
    /**
     * The type.
     */
    type?: string;
}

/**
 * A job item action running a script.
 */
export interface JobItemScriptAction extends JobItemAction, WithScript {
}

/**
 * Arguments for a job item script.
 */
export interface JobItemScriptActionArguments extends WorkspaceScriptArguments {
    /**
     * The underlying button (if available).
     */
    readonly button: vscode.StatusBarItem;
}

/**
 * Job item script module.
 */
export interface JobItemScriptActionModule extends ScriptModule<JobItemScriptActionArguments> {
}

/**
 * A job item action running a shell command.
 */
export interface JobItemShellCommandAction extends JobItemAction, WithShellCommand {
}

/**
 * An object that stores values as key/value pairs.
 */
export type KeyValuePairs<TValue = any> = { [key: string]: TValue };

/**
 * Provides an output channel.
 *
 * @return {vscode.OutputChannel} The output channel.
 */
export type OutputChannelProvider = () => vscode.OutputChannel;

/**
 * Resolve a full (existing) path.
 *
 * @param {string} path The input path.
 *
 * @return {string} The full path or (false) if not found.
 */
export type PathResolver = (path: string) => string | false;

/**
 * A progress context of a 'vscode.window.withProgress()' task.
 */
export interface ProgressContext extends vscode.Progress<{ message?: string; increment?: number }> {
}

/**
 * Options for 'Workspace.runShellCommand()' methods.
 */
export interface RunShellCommandOptions {
    /**
     * Do not show progress window.
     */
    noProgress?: boolean;
}

/**
 * Arguments for a script.
 */
export interface ScriptArguments {
    /**
     * The underlying extension (context).
     */
    readonly extension: vscode.ExtensionContext;
    /**
     * Global data which are available for all scripts.
     */
    readonly globals?: any;
    /**
     * Gets the global state object.
     */
    readonly globalState: KeyValuePairs;
    /**
     * The global store.
     */
    readonly globalStore: Store;
    /**
     * The logger.
     */
    readonly logger: ego_helpers.Logger;
    /**
     * Options for running the script.
     */
    readonly options: any;
    /**
     * The output channel.
     */
    readonly output: vscode.OutputChannel;
    /**
     * Handles a value as string and replaces placeholders.
     *
     * @param {any} val The input value.
     *
     * @return {string} The output value.
     */
    readonly replaceValues: (val: any) => string;
    /**
     * Imports a module from the extension's context.
     *
     * @param {string} id The ID of the module.
     *
     * @return {any} The module.
     */
    readonly require: (id: string) => any;
    /**
     * Provides a property to save data permanently while the current (extension) session.
     */
    state: any;
    /**
     * The user store for the underlying script.
     */
    readonly store: Store;
}

/**
 * A button action based on a script.
 */
export interface ScriptButtonAction extends ButtonAction, WithScript {
}

/**
 * Arguments for a startup script.
 */
export interface ScriptCommandStartupArguments extends WorkspaceScriptArguments {
}

/**
 * A startup item running a script.
 */
export interface ScriptCommandStartupItem extends StartupItem, WithScript {
}

/**
 * A startup script module.
 */
export interface ScriptCommandStartupModule {
    /**
     * Executes the module.
     *
     * @param {ScriptCommandStartupArguments} args Arguments for the execution.
     */
    readonly execute: (args: ScriptCommandStartupArguments) => any;
}

/**
 * A script based event action.
 */
export interface ScriptEventAction extends EventAction, WithScript {
}

/**
 * A general script module.
 */
export interface ScriptModule<TArgs extends ScriptArguments = ScriptArguments> {
    /**
     * Executes the module.
     *
     * @param {TArgs} args The arguments for the execution.
     */
    readonly execute: (args: TArgs) => any;
}

/**
 * Arguments for a script value module.
 */
export interface ScriptValueArguments extends ScriptArguments {
}

/**
 * A value using a script.
 */
export interface ScriptValueItem extends ValueItem, WithScript {
}

/**
 * A script module providing a value.
 */
export interface ScriptValueModule {
    /**
     * Returns the value.
     *
     * @param {ScriptValueScriptArguments} args The arguments for the execution.
     *
     * @return {any} The value.
     */
    readonly getValue: (args: ScriptValueArguments) => any;
}

/**
 * An object that sets a value.
 */
export interface Setter {
    /**
     * Sets a value.
     *
     * @param {any} newValue The new value.
     */
    readonly set: (newValue: any) => void;
}

/**
 * A button action based on a shell command.
 */
export interface ShellCommandButtonAction extends ButtonAction, WithShellCommand {
}

/**
 * A startup item running a (shell) command.
 */
export interface ShellCommandStartupItem extends StartupItem, WithShellCommand {
}

/**
 * Runs a shell command to provide a value.
 */
export interface ShellValueItem extends ValueItem {
    /**
     * The custom working directory.
     */
    cwd?: string;
    /**
     * The command to execute.
     */
    command: string;
    /**
     * Trim the value.
     */
    trim?: boolean;
}

/**
 * Stores Slack API credentials.
 */
export interface SlackAPICredentials {
    /**
     * The access token.
     */
    token: string;
}

/**
 * A startup entry.
 */
export type StartupEntry = string | StartupItem;

/**
 * A startup item.
 */
export interface StartupItem extends CanImportValues, Conditional, ForPlatforms {
    /**
     * The type.
     */
    type?: string;
}

/**
 * A static value item.
 */
export interface StaticValueItem extends ValueItem {
    /**
     * The value.
     */
    value: any;
}

/**
 * Stores data.
 */
export interface Store {
    /**
     * Tries to return a value from the store.
     *
     * @param {any} key The key.
     * @param {TDefault} [defaultValue] The custom default value.
     *
     * @return {TValue|TDefault} The read value or the default value.
     */
    get<TValue = any, TDefault = TValue>(key: any, defaultValue?: TDefault): TValue | TDefault;
    /**
     * Tries set a value in the store.
     *
     * @param {any} key The key.
     * @param {any} value The value to set.
     *
     * @return {Promise<boolean>} The promise with the value that indicates if operation was successfull or not.
     */
    set(key: any, value: any): Promise<boolean>;
}

/**
 * An item of a TCP proxy list.
 */
export interface TcpProxyListItem {
    /**
     * The display name.
     */
    displayName?: string;
    /**
     * The (local) address, the proxy should listen on.
     */
    from: {
        /**
         * The hostname.
         */
        hostname: string;
        /**
         * The TCP port.
         */
        port: number;
    };
    /**
     * The (remote) address, the proxy should connect to.
     */
    to: {
        /**
         * The hostname.
         */
        host: string;
        /**
         * The port.
         */
        port: number;
    };
}

/**
 * A value.
 */
export interface Value {
    /**
     * The name of the value (if available).
     */
    readonly name?: string;
    /**
     * The value.
     */
    readonly value: any;
}

/**
 * A value entry.
 */
export type ValueEntry = string | ValueItem;

/**
 * A value item.
 */
export interface ValueItem extends Conditional, ForPlatforms {
    /**
     * The value type.
     */
    type?: string;
}

/**
 * Provides values.
 *
 * @return {Value[]} The values.
 */
export type ValueProvider = () => Value[];

/**
 * An object that stores values, by their names.
 */
export type ValueStorage = { [name: string]: any };

/**
 * Settings for view columns.
 */
export type ViewColumnSettings = vscode.ViewColumn | { viewColumn: vscode.ViewColumn, preserveFocus?: boolean };

/**
 * A message from and for a WebView.
 */
export interface WebViewMessage<TData = any> {
    /**
     * The command.
     */
    command: string;
    /**
     * The data.
     */
    data?: TData;
}

/**
 * Data of log message from a web view.
 */
export interface WebViewLogMessageData {
    /**
     * The message as serialized data.
     */
    message: string;
}

/**
 * Options for a web view with a panel.
 */
export type WebViewWithPanelOptions = vscode.WebviewPanelOptions & vscode.WebviewOptions;

/**
 * An object, which can execute optional (JavaScript) code after it has been created and/ore destroyed.
 */
export interface WithCreationEvents {
    /**
     * The (JavaScript) code to executed after object has been created.
     */
    onCreated?: string;
    /**
     * The (JavaScript) code to executed after object has been destroyed.
     */
    onDestroyed?: string;
}

/**
 * An object, which can execute optional (JavaScript) code after active editor has changed events.
 */
export interface WithEditorChangedEvents {
    /**
     * The (JavaScript) code to executed after active editor has changed.
     */
    onEditorChanged?: string;
}

/**
 * An object that uses a script.
 */
export interface WithScript extends WithState {
    /**
     * Options for running the script.
     */
    options?: any;
    /**
     * The path to the script to invoke.
     */
    script: string;
}

/**
 * Object that uses a shell command.
 */
export interface WithShellCommand {
    /**
     * The custom working directory.
     */
    cwd?: string;
    /**
     * The command to execute.
     */
    command: string;
    /**
     * Do not write result to output.
     */
    silent?: boolean;
    /**
     * Wait until command has been executed or not. Default: (true).
     */
    wait?: boolean;
}

/**
 * An object with an initial state value.
 */
export interface WithState {
    /**
     * Stores the initial state.
     */
    state?: any;
}

/**
 * An object which contains one or more value entries.
 */
export interface WithValues {
    /**
     * One or more values.
     */
    values?: { [name: string]: ValueEntry };
}

/**
 * A workspace app.
 */
export interface WorkspaceApp extends vscode.Disposable {
    /**
     * The underlying button, if defined.
     */
    readonly button?: vscode.StatusBarItem;
    /**
     * A description of the app.
     */
    readonly description: string;
    /**
     * Detail information.
     */
    readonly detail: string;
    /**
     * The (display) name.
     */
    readonly name: string;
    /**
     * Opens the app.
     *
     * @return {Promise<vscode.Disposable | false>} The promise that stores the new web view instance or (false) if operation failed.
     */
    readonly open: () => Promise<vscode.Disposable | false>;
    /**
     * Gets the current web view instance.
     */
    readonly view: vscode.Disposable;
}

/**
 * Arguments for (workspace) an app script event.
 */
export interface WorkspaceAppEventScriptArguments<TData = any> extends AppEventScriptArguments<TData>, WorkspaceScriptArguments {
    /**
     * @inheritdoc
     */
    readonly globals: any;
}

/**
 * A workspace button.
 */
export interface WorkspaceButton extends GlobalButton {
}

/**
 * A workspace command.
 */
export interface WorkspaceCommand extends GlobalCommand {
}

/**
 * Arguments for a workspace command script.
 */
export interface WorkspaceCommandScriptArguments extends GlobalCommandScriptArguments {
}

/**
 * Arguments for a workspace command, which is executed for an active or selected file.
 */
export interface WorkspaceCommandScriptArgumentsForFiles extends GlobalCommandScriptArgumentsForFiles, WorkspaceCommandScriptArguments {
}

/**
 * Arguments for a workspace command, which is executed for an active or selected folder.
 */
export interface WorkspaceCommandScriptArgumentsForFolders extends GlobalCommandScriptArgumentsForFolders, WorkspaceCommandScriptArguments {
}

/**
 * A workspace command script module.
 */
export interface WorkspaceCommandScriptModule extends WorkspaceCommandScriptArguments {
}

/**
 * An import entry of a workspace configuration.
 */
export interface WorkspaceConfigImport extends vscode.Disposable {
}

/**
 * A workspace event.
 */
export interface WorkspaceEvent extends vscode.Disposable {
    /**
     * Executes the event.
     *
     * @param {string} type The type for what the event should be executed.
     * @param {any[]} [args] One or more arguments for the execution.
     */
    readonly execute: (type: string, ...args: any[]) => void | PromiseLike<void>;
    /**
     * Gets the type.
     */
    readonly type: string;
}

/**
 * Information about a workspace.
 */
export interface WorkspaceInfo {
    /**
     * The zero based index.
     */
    readonly index: number;
    /**
     * The name of the workspace.
     */
    readonly name: string;
    /**
     * The root path.
     */
    readonly rootPath: string;
}

/**
 * A workspace job.
 */
export interface WorkspaceJob extends GlobalJob {
}

/**
 * A list of workspace infos.
 */
export type WorkspaceList = { [name: string]: WorkspaceInfo | WorkspaceInfo[] };

/**
 * Arguments for a workspace based script.
 */
export interface WorkspaceScriptArguments extends ScriptArguments {
    /**
     * @inheritdoc
     */
    readonly globals: any;
}


/**
 * List of file change events.
 */
export enum FileChangeType {
    /**
     * Changed
     */
    Changed,
    /**
     * Created / new
     */
    Created,
    /**
     * Deleted
     */
    Deleted,
    /**
     * Saved / updated by user
     */
    Saved,
    /**
     * Will save
     */
    WillSave,
}

/**
 * The name folder with apps inside of the extension's subfolder of the current user.
 */
export const APPS_SUBFOLDER = '.apps';

/**
 * The URL to the (default) app store.
 */
export const EGO_APP_STORE = 'https://egodigital.github.io/vscode-powertools/apps/store.json';

/**
 * Name of the event for a new app.
 */
export const EVENT_APP_LIST_UPDATED = 'apps.updated-list';

/**
 * (Display) Name of the extension.
 */
export const EXTENSION_NAME = 'Power Tools by e.GO';

/**
 * The name of the file that is the entry for a global app.
 */
export const GLOBAL_APP_ENTRY = 'index.js';

/**
 * The name of the extension's subfolder inside the home directory of the current user.
 */
export const HOMEDIR_SUBFOLDER = '.vscode-powertools';

/**
 * Name of an ignore file.
 */
export const IGNORE_FILE = '.egoignore';

/**
 * The key for the global setting that stores the app store URL.
 */
export const KEY_GLOBAL_SETTING_APP_STORE_URL = 'egoPTAppStoreUrl';

/**
 * The key for the list of known apps.
 */
export const KEY_KNOWN_APPS = 'egoPTKnownApps';

/**
 * The key of the last executed code.
 */
export const KEY_LAST_CODE_EXECUTION = 'egoPTLastCodeExecution';

/**
 * The key for the global setting that stores if the global Azure DevOps organization.
 */
export const KEY_GLOBAL_SETTING_AZURE_DEVOPS_GLOBAL_ORG = 'egoPTAzureDevOpsGlobalOrg';

/**
 * The key for the global setting that stores if the global Azure DevOps PAT.
 */
export const KEY_GLOBAL_SETTING_AZURE_DEVOPS_GLOBAL_PAT = 'egoPTAzureDevOpsGlobalPAT';

/**
 * The key for the global setting that stores if the global Azure DevOps username.
 */
export const KEY_GLOBAL_SETTING_AZURE_DEVOPS_GLOBAL_USERNAME = 'egoPTAzureDevOpsGlobalUsername';

/**
 * The key for the global setting that stores if the Azure DevOps organization for the current workspace.
 */
export const KEY_GLOBAL_SETTING_AZURE_DEVOPS_WORKSPACE_ORG = 'egoPTAzureDevOpsWorkspaceOrg';

/**
 * The key for the global setting that stores if the Azure DevOps PAT for the current workspace.
 */
export const KEY_GLOBAL_SETTING_AZURE_DEVOPS_WORKSPACE_PAT = 'egoPTAzureDevOpsWorkspacePAT';

/**
 * The key for the global setting that stores if the Azure DevOps username for the current workspace.
 */
export const KEY_GLOBAL_SETTING_AZURE_DEVOPS_WORKSPACE_USERNAME = 'egoPTAzureDevOpsWorkspaceUsername';

/**
 * The key for the global setting that stores a MapBox API token.
 */
export const KEY_GLOBAL_SETTING_MAPBOX_API_TOKEN = 'egoPTMapBoxApiToken';

/**
 * The key for the global setting that stores if CHANGELOG should be opened on startup automatically.
 */
export const KEY_GLOBAL_SETTING_OPEN_CHANGELOG_ON_STARTUP = 'egoPTOpenChangelogOnStartup';

/**
 * The key for the global setting that stores a Slack API credentials.
 */
export const KEY_GLOBAL_SETTING_SLACK_API_CREDENTIALS = 'egoPTSlackAPICredentials';

/**
 * The key of known TCP proxies.
 */
export const KEY_TCP_PROXIES = 'egoPTTcpProxies';
