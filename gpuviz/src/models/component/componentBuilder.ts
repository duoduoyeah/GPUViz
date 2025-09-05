import { ComponentNodeImpl } from "./componentNode";
import type { NodeInfo, ComponentKind } from "../../types/index";

export class ComponentBuilder {
  private component: ComponentNodeImpl;

  constructor(name: string) {
    this.component = new ComponentNodeImpl(name);
  }

  withInfo(info: NodeInfo): ComponentBuilder {
    this.component.setInfo(info);
    return this;
  }

  withType(type: string): ComponentBuilder {
    this.component.setType(type);
    return this;
  }

  withShape(): ComponentBuilder {
    this.component.setShape();
    return this;
  }

  build(): ComponentNodeImpl {
    return this.component;
  }
}