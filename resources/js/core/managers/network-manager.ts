import { Events } from '../../ui/events';
import { EventManager } from './event-manager';
import { DebugInfo } from '../../ui/dev/dev-tools';

const WS_SERVER_HOST = '127.0.0.1';
const WS_SERVER_PORT = '7000';
const WS_PROTOCOL = 'ws';

class NetworkManager {
    private static socket: WebSocket;
    private static timeoutId: number;
    private static retryAfterSeconds: number = 5;
    private static failedConnections: number = 0;
    private static readonly failedConnectionsLimit = 10;

    public static connect() {
        this.updateStatus('Connecting...');
        this.socket = new WebSocket(`${WS_PROTOCOL}://${WS_SERVER_HOST}:${WS_SERVER_PORT}`);

        this.socket.addEventListener('open', () => {
            this.updateStatus('Online', 'success');
            clearInterval(this.timeoutId);
        });

        this.socket.addEventListener('close', () => {
            clearInterval(this.timeoutId);
            this.failedConnections++;
            this.updateStatus(`Retrying (${this.failedConnections} / ${this.failedConnectionsLimit})...`);

            if (this.failedConnections < this.failedConnectionsLimit) {
                this.timeoutId = setInterval(() => {
                    this.connect();
                }, this.retryAfterSeconds * 1000) as any;
            } else {
                this.updateStatus('Offline', 'error');
            }
        });
    }

    public static updateStatus(connectionStatus: string, type?: any) {
        EventManager.dispatch(
            Events.DEBUG_INFO_UPDATE,
            new DebugInfo('Network', {
                title: 'Game API',
                value: connectionStatus,
                status: type,
            })
        );
    }
}

export { NetworkManager };
