import {test,expect} from '@playwright/test';
for(const width of [320,390,1280])for(const reducedMotion of ['no-preference','reduce'] as const){
 test(`${width}px ${reducedMotion}: map, all places, search and controls`,async({page},info)=>{
  test.setTimeout(150000);await page.setViewportSize({width,height:844});await page.emulateMedia({reducedMotion});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await expect(page.getByRole('button',{name:'Explore Ghana',exact:true})).toBeVisible();
  await page.waitForFunction(()=>{const m=(document.querySelector('.leaflet-container') as any)?._warmMap;return m&&m.isStyleLoaded()&&m.queryRenderedFeatures().length>0},null,{timeout:45000});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  const shown=await page.locator('button:visible').allTextContents();expect(shown).toEqual(expect.arrayContaining(['Explore ']));
  expect(await page.locator('.place-cluster').count()).toBeGreaterThan(0);
  if(reducedMotion==='no-preference')await page.screenshot({path:info.outputPath(`ghana-map-${width}.png`)});
  await page.getByRole('button',{name:'Explore Ghana',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'Explore Ghana'})).toBeVisible();
  const search=page.getByRole('textbox',{name:'Search attractions'});await expect(search).toBeFocused();
  await search.fill('impossibleplace');await expect(page.getByText('No places found')).toBeVisible();await page.getByLabel('Clear search').click();await expect(search).toHaveValue('');
  for(const name of ['Zoom in','Zoom out','Reset map'])await page.getByRole('button',{name,exact:true}).click();
  if(reducedMotion==='no-preference')await page.screenshot({path:info.outputPath(`ghana-panel-${width}.png`)});
  const names=await page.locator('ul[aria-label="List of attractions"] li h3').allTextContents();expect(names.length).toBeGreaterThan(10);
  for(const name of names){
    await search.fill(name);await page.locator('ul[aria-label="List of attractions"] li button').first().click();
    const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();await expect(dialog.getByRole('heading',{name,exact:true}).first()).toBeVisible();
    if(name==='Cape Coast Castle')await expect(dialog.locator('img')).toHaveAttribute('src',/\/cape-coast-castle-ghana\.png$/);
    const box=await dialog.boundingBox();expect(box!.x).toBeGreaterThanOrEqual(0);expect(box!.x+box!.width).toBeLessThanOrEqual(width+1);expect(box!.y).toBeGreaterThanOrEqual(0);expect(box!.y+box!.height).toBeLessThanOrEqual(845);
    await dialog.getByRole('button',{name:'Get Directions',exact:true}).scrollIntoViewIfNeeded();await expect(dialog.getByRole('button',{name:'Get Directions',exact:true})).toBeVisible();
    if(name===names[0]&&reducedMotion==='no-preference'){await page.screenshot({path:info.outputPath(`ghana-detail-end-${width}.png`)});await dialog.locator('.overflow-y-auto').evaluate(el=>el.scrollTop=0);await page.screenshot({path:info.outputPath(`ghana-detail-${width}.png`)});await page.getByRole('button',{name:'Close details',exact:true}).click()}else await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();await expect(page.getByRole('button',{name:'Explore Ghana',exact:true})).toBeFocused();
    await page.getByRole('button',{name:'Explore Ghana',exact:true}).click();
  }
  await page.getByLabel('Clear search').click();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Explore Ghana',exact:true})).toBeFocused();
  await page.locator('.place-cluster button').first().click();
  expect(errors).toEqual([]);
 })
}
