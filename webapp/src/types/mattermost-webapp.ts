export interface PluginRegistry {
    registerPostTypeComponent(typeName: string, component: React.ElementType): void
    registerReducer(reducer:any): void
    registerMainMenuAction(component: JSX.Element, callback: any, mobileIcon: JSX.Element): void
    registerWebSocketEventHandler(event:string, handler: any): void

    // Add more if needed from https://developers.mattermost.com/extend/plugins/webapp/reference
}
