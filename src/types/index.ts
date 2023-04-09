export interface Customization {
    name: string;
    content: string;
    position?: "start" | "end";
    autoEnter?: boolean;
}
