import cds from '@sap/cds'

const { GET, POST, expect, defaults } = cds.test (import.meta.dirname+'/..')
defaults.auth = { username: 'alice', password: '' }

describe('CatalogService OData APIs', () => {

  it('serves CatalogService.ListOfBooks', async () => {
    const { data } = await GET `/odata/v4/catalog/ListOfBooks ${{ params: { $select: 'ID,author' } }}`
    expect(data.value).to.containSubset([
      // {"ID":19386249,"author":"author-19386249"},
    ])
  })

  it('executes submitOrder', async () => {
    const { data } = await POST `/odata/v4/catalog/submitOrder ${
      {}
      // {"book":6659830,"quantity":18}
    }`
    // TODO finish this test
    // expect(data.value).to...
  })
})
