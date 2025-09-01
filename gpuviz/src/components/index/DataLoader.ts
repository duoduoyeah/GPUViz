import useGpuStore from '../../store/gpuStore';
import {SqliteComponentNodeBuilder}  from '../../models/dataLoader';
import { ComponentTreeImpl } from '../../models/componentTree';


async function buildTopologyFromSQLite() {
    // 1. Validate required tables and columns
    const defaultInfo = {};
    const builder = new SqliteComponentNodeBuilder(defaultInfo);

    // 2. Read topology ports and port connections
    const rawPorts = await builder.readTopologyPortFromSQlite();
    const rawConnections = await builder.readPortConnectionFromSQlite();

    // 3. Build root components from sqlite
    const rootComponents = builder.buildFromSqlite(rawPorts, rawConnections);

    // 4. Create component tree
    const componentTree = new ComponentTreeImpl(rootComponents);

    // 5. Load topology into gpuStore
    useGpuStore.getState().loadTopology(componentTree);
}

async function importMessagesFromSQLite() {
    //TODO
}

export async function loadDataFromFile() {
    await buildTopologyFromSQLite();
    await importMessagesFromSQLite();
}




