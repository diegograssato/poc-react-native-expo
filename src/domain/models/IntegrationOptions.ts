import { IntegrationType } from "./IntegrationType";

export default class IntegrationOptions {
  state: boolean;
  type: IntegrationType;

  constructor(state: boolean, type: IntegrationType) {
    this.state = state;
    this.type = type
  }
}

export class IntegrationOptionsMapper {
  public static dataToOption(
    state: boolean,
    type: IntegrationType
  ): IntegrationOptions {
    const model = new IntegrationOptions(state, type);
     return model;
  }
}