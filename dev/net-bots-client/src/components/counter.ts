import { html, Hybrids } from 'hybrids';

interface SimpleCounter {
    count: number;
}

export function increaseCount(host: SimpleCounter) {
    host.count += 2;
}

export const SimpleCounter: Hybrids<SimpleCounter> = {
    count: 0,
    render: ({ count }) => html`
        <button onclick="${increaseCount}">
            Count: ${count}
        </button>
    `.css`button { background-color: red; }`,
};