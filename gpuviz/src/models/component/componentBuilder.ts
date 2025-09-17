import { ComponentNodeImpl } from "./componentNode";
import type { NodeInfo} from "../../types/index";

// Basic builder interface - requires shape, info, and type
export interface IBasicNodeBuilder {
  withShape(): IBasicNodeBuilder;
  withInfo(info: NodeInfo): IBasicNodeBuilder;
  withType(type: string): IBasicNodeBuilder;
  build(): ComponentNodeImpl;
}



// Basic Component Builder
export class BasicComponentBuilder implements IBasicNodeBuilder {
  private component: ComponentNodeImpl;

  constructor(name: string) {
    this.component = new ComponentNodeImpl(name);
  }

  withInfo(info: NodeInfo): BasicComponentBuilder {
    this.component.setInfo(info);
    return this;
  }

  withType(type: string): BasicComponentBuilder {
    this.component.setType(type);
    return this;
  }

  withShape(): BasicComponentBuilder {
    this.component.setShape();
    return this;
  }

  build(): ComponentNodeImpl {
    return this.component;
  }

  static create(name: string): BasicComponentBuilder {
    return new BasicComponentBuilder(name);
  }
}

