import React, {useState} from "react";
import {Button, ButtonGroup, Card, Collapse, FormGroup, H5, NumericInput, Spinner, Tag} from "@blueprintjs/core";
import {FiltersForm} from "../filters/FiltersForm";
import {useExploreConfig} from "../hooks/useExploreConfig";
import {useExplores} from "../hooks/useExplores";
import {ResultsTable} from "./ResultsTable";
import {ChartType, SimpleChart} from "./SimpleChart";
import {RenderedSql} from "./RenderedSql";
import {useSqlQuery} from "../hooks/useSqlQuery";

export const Explorer = () => {
    const {
        activeDimensions,
        activeMetrics,
        activeTableName,
        activeFilters,
        resultsRowLimit,
        setResultsRowLimit
    } = useExploreConfig()
    const { refresh: refreshSqlQuery } = useSqlQuery()
    const exploresResults = useExplores()
    const activeExplore = (exploresResults.data || []).find(e => e.name === activeTableName)
    const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false)
    const [resultsIsOpen, setResultsIsOpen] = useState<boolean>(true)
    const [sqlIsOpen, setSqlIsOpen] = useState<boolean>(false)
    const [vizIsOpen, setVizisOpen] = useState<boolean>(false)
    const totalActiveFilters = activeFilters.flatMap(filterGroup => filterGroup.filters.length).reduce((p, t) => p + t, 0)
    const [activeVizTab, setActiveVizTab] = useState<ChartType>('column')

    return (
        <React.Fragment>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
                <Button intent={"primary"} style={{height: '40px', width: 150, marginRight: '10px'}} onClick={refreshSqlQuery}
                        disabled={[...activeMetrics, ...activeDimensions].length === 0}>Run query</Button>
                { exploresResults.isFetching
                    ? <Button disabled={true}><div style={{display: 'flex', flexDirection: 'row'}}><Spinner size={15}/><div style={{paddingRight: '5px'}} />Refreshing dbt</div></Button>
                    : <Button icon={'refresh'} onClick={exploresResults.refresh}>Refresh dbt</Button>
                }

            </div>
            <div style={{paddingTop: '10px'}} />
            <Card style={{padding: 5}} elevation={1}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Button disabled={activeExplore === undefined} icon={filterIsOpen ? 'chevron-down' : 'chevron-right'} minimal={true} onClick={() => setFilterIsOpen(f => !f)} />
                    <H5 style={{margin: 0, padding: 0}}>Filters</H5>
                    {totalActiveFilters > 0 ? <Tag style={{marginLeft: '10px'}}>{totalActiveFilters} active filters</Tag> : null}
                </div>
               <Collapse isOpen={filterIsOpen}>
                   {activeExplore && <FiltersForm />}
               </Collapse>
            </Card>
            <div style={{paddingTop: '10px'}} />

            <Card style={{padding: 5}} elevation={1}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Button disabled={activeExplore === undefined} icon={vizIsOpen ? 'chevron-down' : 'chevron-right'} minimal={true} onClick={() => setVizisOpen(f => !f)} />
                        <H5 style={{margin: 0, padding: 0}}>Charts</H5>
                    </div>
                    {vizIsOpen &&
                        <ButtonGroup minimal={true}>
                            <Button active={activeVizTab === 'column' } icon={'timeline-bar-chart'} onClick={() => setActiveVizTab('column')}>Column</Button>
                            <Button active={activeVizTab === 'bar' } icon={'horizontal-bar-chart'} onClick={() => setActiveVizTab('bar')}>Bar</Button>
                            <Button active={activeVizTab === 'line' } icon={'timeline-line-chart'} onClick={() => setActiveVizTab('line')}>Line</Button>
                            <Button active={activeVizTab === 'scatter' } icon={'scatter-plot'} onClick={() => setActiveVizTab('scatter')}>Scatter</Button>
                        </ButtonGroup>
                    }
                </div>
                <Collapse isOpen={vizIsOpen}>
                    <SimpleChart chartType={activeVizTab}/>
                </Collapse>
            </Card>
            <div style={{paddingTop: '10px'}} />

            <Card style={{ padding: 5 }} elevation={1}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Button icon={resultsIsOpen ? 'chevron-down' : 'chevron-right'} minimal={true} onClick={() => setResultsIsOpen(f => !f)} />
                        <H5 style={{margin: 0, padding: 0}}>Results</H5>
                    </div>
                    {resultsIsOpen && <FormGroup style={{marginRight: 12}} label="Total rows:" inline={true}><NumericInput style={{width: 100}} buttonPosition={'none'} value={resultsRowLimit} onValueChange={setResultsRowLimit}/></FormGroup>}
                </div>
                <Collapse isOpen={resultsIsOpen}>
                    <ResultsTable />
                </Collapse>
            </Card>
            <div style={{paddingTop: '10px'}} />
            <Card style={{padding: 5, height: sqlIsOpen ? '100%' : 'auto'}} elevation={1}>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Button icon={sqlIsOpen ? 'chevron-down' : 'chevron-right'} minimal={true} onClick={() => setSqlIsOpen(f => !f)} />
                    <H5 style={{margin: 0, padding: 0}}>SQL</H5>
                </div>
                <Collapse isOpen={sqlIsOpen}>
                    <RenderedSql />
                </Collapse>
            </Card>
        </React.Fragment>
    )
}

