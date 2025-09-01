import useGpuStore from '../../store/gpuStore';
import {SqliteComponentNodeBuilder}  from '../../models/dataLoader';
import { ComponentTreeImpl } from '../../models/componentTree';

async function buildFromJson(jsonFilePath: string) {
    useGpuStore.setState({ error: "Json Not Support Yet" });
    }

async function buildTopologyFromSQLite(sqliteFilePath: string) {
    // 1. Validate required tables and columns
    const defaultInfo = {};
    const builder = new SqliteComponentNodeBuilder(defaultInfo);

    // 2. Read topology ports and port connections
    const rawPorts = builder.readTopologyPortFromSQlite();
    const rawConnections = builder.readPortConnectionFromSQlite();

    // 3. Build root components from sqlite
    const rootComponents = builder.buildFromSqlite(rawPorts, rawConnections);

    // 4. Create component tree
    const componentTree = new ComponentTreeImpl(rootComponents);

    // 5. Load topology into gpuStore
    useGpuStore.getState().loadTopology(componentTree);
}

async function importMessagesFromSQLite(sqliteFilePath: string) {
    //TODO
    }

export async function loadDataFromFile(filePath: string) {
    // modify gpustore state at beginning
    if (filePath.endsWith('.json')) {
        await buildFromJson(filePath);
    } else if (filePath.endsWith('.sqlite') || filePath.endsWith('.sqlite3')) {
        await buildTopologyFromSQLite(filePath);
        await importMessagesFromSQLite(filePath);
    }

}




