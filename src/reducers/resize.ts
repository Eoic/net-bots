type State = {
  isResizing: boolean;
  railSize: { w: number, h: number };
};

type ActionPayload = {
  railSize?: { w: number, h: number };
};

type Action =
  | {
      type: 'resize';
      payload: ActionPayload;
    }
  | {
      type: 'beginResize';
      payload: ActionPayload;
    }
  | {
      type: 'endResize';
    };

export const EdgeSnapDistance = 15;

export const resizeReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'resize':
      return {
        isResizing: state.isResizing,
        railSize: action.payload.railSize || { w: 0, h: 0},
      };
    case 'beginResize':
      return {
        isResizing: true,
        railSize: action.payload.railSize || { w: 0, h: 0 },
      };
    case 'endResize':
      return {
        isResizing: false,
        railSize: state.railSize,
      };
    default:
      return { ...state };
  }
};
