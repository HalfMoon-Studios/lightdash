import {
    BinType,
    DimensionType,
    Explore,
    FieldType,
    MetricQuery,
    MetricType,
    Source,
    SupportedDbtAdapter,
} from '../index';

export const metricQuery: MetricQuery = {
    exploreName: 'table1',
    dimensions: ['table1_dim1', 'table2_dim2'],
    metrics: ['table1_metric1', 'table2_metric2'],
    filters: {},
    sorts: [],
    limit: 500,
    tableCalculations: [
        {
            name: 'calc2',
            displayName: '',
            sql: 'dim reference ${table1.dim1}',
        },
    ],
    additionalMetrics: [
        {
            name: 'additional_metric_1',
            sql: '${TABLE}.dim1',
            table: 'table1',
            type: MetricType.COUNT,
            description: 'My description',
        },
    ],
    customDimensions: [
        {
            id: 'custom_dimension_1',
            name: 'custom_dimension_1',
            dimensionId: 'table1_dim1', // Parent dimension id
            binType: BinType.FIXED_NUMBER,
            binNumber: 5,
            table: 'table1',
        },
    ],
};

const exploreBase: Explore = {
    targetDatabase: SupportedDbtAdapter.POSTGRES,
    name: '',
    label: '',
    tags: [],
    baseTable: 'a',
    joinedTables: [],
    tables: {},
    groupLabel: undefined,
};

const sourceMock: Source = {
    path: '',
    content: '',
    range: {
        start: {
            line: 0,
            character: 0,
        },
        end: {
            line: 0,
            character: 0,
        },
    },
};
export const explore: Explore = {
    ...exploreBase,
    tables: {
        table1: {
            name: 'table1',
            label: 'table1',
            database: 'database',
            schema: 'schema',
            sqlTable: 'test.table',
            sqlWhere: undefined,
            dimensions: {
                dim1: {
                    fieldType: FieldType.DIMENSION,
                    type: DimensionType.STRING,
                    name: 'dim1',
                    label: 'dim1',
                    table: 'table1',
                    tableLabel: 'table1',
                    sql: '${TABLE}.dim1',
                    compiledSql: '"table1".dim1',
                    tablesReferences: ['table1'],
                    source: sourceMock,
                    hidden: false,
                },
            },
            metrics: {
                metric1: {
                    fieldType: FieldType.METRIC,
                    type: MetricType.AVERAGE,
                    name: 'metric1',
                    label: 'metric1',
                    table: 'table1',
                    tableLabel: 'table1',
                    sql: 'AVG(${TABLE}.metric1)',
                    source: sourceMock,
                    isAutoGenerated: false,
                    hidden: false,
                    compiledSql: 'AVG("table1".metric1)',
                    tablesReferences: ['table1'],
                },
            },
            lineageGraph: {},
            groupLabel: undefined,
            source: sourceMock,
        },
    },
};

export const emptyExplore: Explore = {
    ...exploreBase,
    tables: {},
};

export const emptyMetricQuery: MetricQuery = {
    exploreName: 'test',
    dimensions: [],
    metrics: [],
    filters: {},
    sorts: [],
    limit: 500,
    tableCalculations: [],
};
