import { getConnection } from "../database/database";

export const initialPage = async (req, res) => {
    const pool = await getConnection();
    const query = " SELECT ProductId, Name, ListPrice FROM NorthAmerica.Production.Product WHERE SellEndDate IS NULL AND ListPrice != 0.00 ";
    const result = await pool.request().query(query);
    console.log(result)
    res.render('index', {results: result.recordset});
};

// Ordenes para empleados por territorio
export const employeeData = async (req, res) => {
    const pool = await getConnection();
    const a = ` SELECT E.BusinessEntityID, E.JobTitle, P.FirstName, P.LastName 
                FROM NorthAmerica.HumanResources.Employee AS E
                INNER JOIN (	SELECT * 
                                FROM NorthAmerica.Person.Person) AS P
                ON E.BusinessEntityID = P.BusinessEntityID `;
     
    const b = `SELECT * FROM OPENQUERY(SREMOTO, '	SELECT E.BusinessEntityID, E.JobTitle, P.FirstName, P.LastName 
                                                    FROM EuroPacific.HumanResources.Employee AS E
                                                    INNER JOIN (	SELECT * 
                                                                    FROM EuroPacific.Person.Person) AS P
                                                    ON E.BusinessEntityID = P.BusinessEntityID')`;
    const result1 = await pool.request().query(a);
    const result2 = await pool.request().query(b);
    //console.log(result1)
    //console.log(result2)
    res.render('employees', {results1: result1.recordset,
                             results2: result2.recordset})
};

export const employeeDataFiltered = async (req, res) => {
    const pool = await getConnection();
    // se obtiene el grupo que se quiere filtrar
    const _group = req.query.Group;
    //console.log("grupo obtenido: ",_group)
    // consulta a diccionario de distribucion par buscar los datos pertenecientes al grupo seleccionado
    const a = ` SELECT TerritoryID, DatabaseName 
                FROM NorthAmerica.dbo.DistributionData
                WHERE GroupName = '${_group}' `;
    const query_a = await pool.request().query(a);  // recibe la ubicacion de los datos del grupo obtenido  
    const datosCompletos = {};  
    for (let i = 0; i < query_a.rowsAffected; i++){
        if(query_a.recordset[i].DatabaseName == 'North America'){
            const b = `   SELECT E.BusinessEntityID, E.JobTitle, P.FirstName, P.LastName 
                                FROM NorthAmerica.HumanResources.Employee AS E
                                INNER JOIN (	SELECT * 
                                                FROM NorthAmerica.Person.Person) AS P
                                ON E.BusinessEntityID = P.BusinessEntityID
                                WHERE E.BusinessEntityID IN (	SELECT BEA.BusinessEntityID
                                                                FROM NorthAmerica.Person.BusinessEntityAddress AS BEA
                                                                INNER JOIN (	SELECT A.AddressID, A.StateProvinceID, SP.TerritoryID
                                                                                FROM NorthAmerica.Person.Address AS A
                                                                                INNER JOIN (	SELECT * 
                                                                                                FROM NorthAmerica.Person.StateProvince) AS SP
                                                                                ON A.StateProvinceID = SP.StateProvinceID) AS SQL1
                                                                ON BEA.AddressID = SQL1.AddressID
                                                                WHERE SQL1.TerritoryID = ${query_a.recordset[i].TerritoryID}) `
            const query_b = await pool.request().query(b);
            datosCompletos= json.push({
                BusinessEntityID: query_b.recordset[0].BusinessEntityID,
                JobTitle: query_b.recordset[0].JobTitle,
                FirstName: query_b.recordset[0].FirstName,
                LastName: query_b.recordset[0].LastName
            })
            //console.log(query_b)
        } else if (query_a.recordset[i].DatabaseName == 'EuroPacific'){
            const c = ` SELECT * FROM OPENQUERY(SREMOTO, '	SELECT E.BusinessEntityID, E.JobTitle, P.FirstName, P.LastName 
                                                                    FROM EuroPacific.HumanResources.Employee AS E
                                                                    INNER JOIN (	SELECT * 
                                                                                    FROM EuroPacific.Person.Person) AS P
                                                                    ON E.BusinessEntityID = P.BusinessEntityID
                                                                    WHERE E.BusinessEntityID IN (	SELECT BEA.BusinessEntityID
                                                                                                    FROM EuroPacific.Person.BusinessEntityAddress AS BEA
                                                                                                    INNER JOIN (	SELECT A.AddressID, A.StateProvinceID, SP.TerritoryID
                                                                                                                    FROM EuroPacific.Person.Address AS A
                                                                                                                    INNER JOIN (	SELECT * 
                                                                                                                                    FROM EuroPacific.Person.StateProvince) AS SP
                                                                                                                    ON A.StateProvinceID = SP.StateProvinceID) AS SQL1
                                                                                                    ON BEA.AddressID = SQL1.AddressID
                                                                                                    WHERE SQL1.TerritoryID = ${query_a.recordset[i].TerritoryID})') `
            const query_c = await pool.request().query(c);
            //console.log(query_c)
            datosCompletos= json.push({
                BusinessEntityID: query_c.recordset[0].BusinessEntityID,
                JobTitle: query_c.recordset[0].JobTitle,
                FirstName: query_c.recordset[0].FirstName,
                LastName: query_c.recordset[0].LastName
            })
        }
    }

    console.log(datosCompletos)
    res.json('solved')
}