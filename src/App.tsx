import {
  AppBar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
} from "@mui/material";
import React from "react";
import { BsSearch } from "react-icons/bs";
const App = () => {
  const [vulnerabilities, setVulnerabilies] = React.useState<any[]>([]);
  const getVulnerabilities = async (searchCriteria: string) => {
    setVulnerabilies([]);
    let url =
      "https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=" +
      searchCriteria;
    let response = await fetch(url);
    let content = await response.json();
    console.log(content);
    setVulnerabilies(content.vulnerabilities);
  };
  const [searchCriteria, setSearchCriteria] = React.useState("");

  React.useEffect(() => {
    console.log(vulnerabilities);
  }, [vulnerabilities]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="w-full font-kanit font-light">
      <AppBar className="w-full h-20">
        <Toolbar className="w-full h-full flex justify-between items-center">
          <h1>NVD -PLUS</h1>
          <div className="w-1/2 h-12 rounded-md bg-primary border-2 border-primary flex">
            <input
              className="w-11/12 placeholder:font-kanit h-full outline-none rounded-l-md pl-4 bg-white text-black font-kanit"
              placeholder="Rechercher un vulnerabilite."
              value={searchCriteria}
              onChange={(e) => setSearchCriteria(e.target.value)}
            />
            <button
              className="rounded-r-md w-1/12 h-full flex justify-center items-center"
              onClick={() => getVulnerabilities(searchCriteria)}
            >
              <BsSearch className="text-xl" />
            </button>
          </div>
        </Toolbar>
      </AppBar>
      <div className="h-20"></div>
      <div className="p-10">
        {vulnerabilities.length === 0 ? (
          <div>Aucun resultat</div>
        ) : (
          <div className="w-full">
            {" "}
            <Paper>
              {" "}
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Id</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Severite</TableCell>
                    </TableRow>
                    <TableRow></TableRow>
                  </TableHead>
                  <TableBody>
                    {vulnerabilities
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.code}
                          >
                            <TableCell>{row.cve.id}</TableCell>
                            <TableCell>
                              {row.cve.descriptions[0].value}
                            </TableCell>
                            <TableCell>
                              {row.cve.metrics.cvssMetricV2[0].baseSeverity}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={vulnerabilities.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
