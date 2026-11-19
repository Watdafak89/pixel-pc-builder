/* =========================================================
   PIXEL PC BUILDER ACADEMY — EDUCATIONAL HARDWARE DATABASE
   ========================================================= */
window.PCData = (function () {
  const CATALOG = {
    mb: [
      {
        id: 'mb_b760',
        cat: 'mb',
        name: 'PixelTech B760M-PRO',
        short: 'B760M (LGA1700/DDR4)',
        socket: 'LGA1700',
        ramType: 'DDR4',
        watt: 35,
        price: 3200,
        tier: 1,
        color: '#2d3748',
        accent: '#38bdf8',
        desc: 'เมนบอร์ดขนาด Micro-ATX ยอดนิยม รองรับซีพียูซ็อกเก็ต LGA1700 และแรม DDR4 มีสล็อต M.2 NVMe และ PCIe x16 ครบครัน',
        tip: 'วางเมนบอร์ดให้รูยึดตรงกับหมุดรอง (Standoffs) ในเคสเสมอ เพื่อป้องกันไฟลัดวงจรด้านหลังบอร์ด'
      },
      {
        id: 'mb_z790',
        cat: 'mb',
        name: 'AorusPixel Z790-ULTRA',
        short: 'Z790 (LGA1700/DDR5)',
        socket: 'LGA1700',
        ramType: 'DDR5',
        watt: 50,
        price: 7500,
        tier: 3,
        color: '#1e293b',
        accent: '#fbbf24',
        desc: 'เมนบอร์ดรุ่นเรือธงภาคจ่ายไฟ VRM แข็งแกร่ง รองรับซ็อกเก็ต LGA1700 และแรมความเร็วสูง DDR5 พร้อมฮีตซิงก์ระบายความร้อนเต็มแผง',
        tip: 'สังเกตประเภทแรมที่รองรับ (DDR5) เพราะร่องบากของ DDR4 กับ DDR5 อยู่คนละตำแหน่ง เสียบแทนกันไม่ได้'
      },
      {
        id: 'mb_b650',
        cat: 'mb',
        name: 'RyzenBit B650M-WIFI',
        short: 'B650M (AM5/DDR5)',
        socket: 'AM5',
        ramType: 'DDR5',
        watt: 45,
        price: 5400,
        tier: 2,
        color: '#272038',
        accent: '#f43f5e',
        desc: 'เมนบอร์ดซ็อกเก็ต AM5 ยุคใหม่ รองรับแรม DDR5 และ PCIe Gen4/5 เหมาะทั้งงานเล่นเกมและงานประมวลผลหนัก',
        tip: 'ซ็อกเก็ต AM5 เป็นแบบ LGA (เข็มอยู่ที่เมนบอร์ด) ระวังอย่าให้มือหรือสิ่งของไปโดนหน้าสัมผัสเข็มในซ็อกเก็ต'
      },
      {
        id: 'mb_b550',
        cat: 'mb',
        name: 'PixelStar B550M-PLUS',
        short: 'B550M (AM4/DDR4)',
        socket: 'AM4',
        ramType: 'DDR4',
        watt: 35,
        price: 2700,
        tier: 1,
        color: '#1f2438',
        accent: '#fb923c',
        desc: 'เมนบอร์ดซ็อกเก็ต AM4 สุดคุ้ม ใช้ร่วมกับแรม DDR4 ได้ในราคาประหยัด เหมาะสำหรับคอมเกมมิ่งงบประหยัดและอัปเกรดเครื่องเดิม',
        tip: 'ซ็อกเก็ต AM4 เป็นแบบ PGA (เข็มอยู่ที่ตัว CPU) เวลานำ CPU มาวางให้ตรวจสอบขาเข็มไม่ให้งอและหย่อนลงเบาๆ'
      }
    ],
    cpu: [
      {
        id: 'cpu_i3',
        cat: 'cpu',
        name: 'CoreBit i3-14100',
        short: 'i3-14100 (LGA1700)',
        socket: 'LGA1700',
        cores: '4C/8T',
        tdp: 60,
        watt: 60,
        price: 3800,
        office: 85, gaming: 64, work: 55,
        desc: 'ซีพียู 4 คอร์ 8 เธรด ประหยัดพลังงาน เหมาะสำหรับงานเอกสาร เรียนออนไลน์ เขียนโค้ดเบื้องต้น และเกมทั่วไป',
        tip: 'วาง CPU ลงในซ็อกเก็ตโดยสังเกต "สามเหลี่ยมสีทอง" ที่มุมซีพียูให้ตรงกับมุมซ็อกเก็ต ห้ามออกแรงกด!'
      },
      {
        id: 'cpu_r5_5600',
        cat: 'cpu',
        name: 'RyzenPix 5 5600',
        short: 'R5 5600 (AM4)',
        socket: 'AM4',
        cores: '6C/12T',
        tdp: 65,
        watt: 65,
        price: 3900,
        office: 88, gaming: 82, work: 75,
        desc: 'ซีพียูยอดฮิตสายคุ้มค่า 6 คอร์ 12 เธรดบนซ็อกเก็ต AM4 ประสิทธิภาพเกินราคา เล่นเกมและทำงานได้ลื่นไหล',
        tip: 'ใช้ได้กับเมนบอร์ดซ็อกเก็ต AM4 และแรม DDR4 เท่านั้น ไม่สามารถใส่กับเมนบอร์ด AM5 ได้'
      },
      {
        id: 'cpu_i5',
        cat: 'cpu',
        name: 'CoreBit i5-14400F',
        short: 'i5-14400F (LGA1700)',
        socket: 'LGA1700',
        cores: '10C/16T',
        tdp: 95,
        watt: 95,
        price: 6900,
        office: 95, gaming: 86, work: 80,
        desc: 'ซีพียู 10 คอร์ 16 เธรด คุ้มค่าที่สุดสำหรับสายเกมมิ่งและมัลติทาสก์ ทำงานหลายโปรแกรมพร้อมกันได้ลื่นไหล',
        tip: 'รุ่นที่ลงท้ายด้วย F ไม่มีการ์ดจอในตัว จำเป็นต้องติดตั้งการ์ดจอแยก (GPU) เพื่อให้แสดงผลภาพออกหน้าจอได้'
      },
      {
        id: 'cpu_r5',
        cat: 'cpu',
        name: 'RyzenPix 5 7600',
        short: 'R5 7600 (AM5)',
        socket: 'AM5',
        cores: '6C/12T',
        tdp: 65,
        watt: 65,
        price: 7400,
        office: 96, gaming: 90, work: 82,
        desc: 'ซีพียูซ็อกเก็ต AM5 สถาปัตยกรรมใหม่ แรง เย็น ประหยัดไฟ ทำงานร่วมกับแรม DDR5 ได้อย่างยอดเยี่ยม',
        tip: 'ตรวจสอบให้แน่ใจว่าซ็อกเก็ต CPU (AM5) ตรงกับซ็อกเก็ตบนเมนบอร์ดก่อนสั่งซื้อและติดตั้งทุกครั้ง'
      },
      {
        id: 'cpu_i7',
        cat: 'cpu',
        name: 'CoreBit i7-14700K',
        short: 'i7-14700K (LGA1700)',
        socket: 'LGA1700',
        cores: '20C/28T',
        tdp: 145,
        watt: 145,
        price: 13900,
        office: 99, gaming: 96, work: 95,
        desc: 'ซีพียูพลังแรง 20 คอร์ 28 เธรด เหมาะสำหรับงานตัดต่อ 4K สตรีมมิ่งระดับสูง และเล่นเกมเฟรมเรตสูง',
        tip: 'ซีพียูระดับ 145W ขึ้นไป ควรจับคู่กับชุดระบายความร้อน Tower ใหญ่หรือชุดน้ำ AIO เพื่อคุมอุณหภูมิ'
      },
      {
        id: 'cpu_r7_7800x3d',
        cat: 'cpu',
        name: 'RyzenPix 7 7800X3D',
        short: 'R7 7800X3D (AM5)',
        socket: 'AM5',
        cores: '8C/16T 3D',
        tdp: 120,
        watt: 120,
        price: 14500,
        office: 96, gaming: 100, work: 90,
        desc: 'ราชาซีพียูเกมมิ่งพร้อมเทคโนโลยี 3D V-Cache ขนาดใหญ่ รีดเฟรมเรตเกม AAA และ E-Sports ได้สูงสุดในตลาด',
        tip: 'ควรใช้คู่กับแรม DDR5 และชุดระบายความร้อนที่มีค่า TDP รองรับ 120W ขึ้นไป'
      },
      {
        id: 'cpu_r9',
        cat: 'cpu',
        name: 'RyzenPix 9 7950X',
        short: 'R9 7950X (AM5)',
        socket: 'AM5',
        cores: '16C/32T',
        tdp: 170,
        watt: 170,
        price: 19500,
        office: 100, gaming: 98, work: 100,
        desc: 'ซีพียูระดับ Workstation 16 คอร์ 32 เธรด พลังประมวลผลมหาศาลสำหรับตัดต่อ 4K เรนเดอร์ 3D และรันโมเดล AI',
        tip: 'ซีพียูกำลังไฟสูง (170W TDP) ควรจับคู่กับชุดระบายความร้อนแบบ Tower ใหญ่ หรือชุดน้ำปิด AIO เพื่อไม่ให้เครื่องร้อนเกินไป'
      }
    ],
    cooler: [
      {
        id: 'cool_stock',
        cat: 'cooler',
        name: 'PixelAir Stock Cooler',
        short: 'Stock Air (TDP 95W)',
        style: 'stock',
        coolingCap: 95,
        watt: 5,
        price: 450,
        desc: 'พัดลมระบายความร้อนมาตรฐานขนาดกะทัดรัด เพียงพอสำหรับซีพียูรุ่นประหยัดไฟและใช้งานทั่วไป',
        tip: 'อย่าลืมทาซิลิโคนก่อนวางซิงก์ และเสียบสายพัดลมเข้ากับช่อง CPU_FAN บนเมนบอร์ดเสมอ'
      },
      {
        id: 'cool_tower',
        cat: 'cooler',
        name: 'FrostPixel Tower RGB',
        short: 'Tower RGB (TDP 160W)',
        style: 'tower',
        coolingCap: 160,
        watt: 8,
        price: 1200,
        desc: 'ฮีตซิงก์ทาวเวอร์ท่อทองแดง 4 เส้น พร้อมพัดลม RGB ระบายความร้อนได้ดีเยี่ยมและเสียงเงียบกว่าซิงก์เดิม',
        tip: 'หันด้านพัดลมเป่าลมผ่านฟินอะลูมิเนียมไปทางด้านหลังเคส เพื่อให้สอดคล้องกับทิศทางลม Airflow'
      },
      {
        id: 'cool_dual_tower',
        cat: 'cooler',
        name: 'TitanFrost Dual-Tower Pro',
        short: 'Dual-Tower (TDP 200W)',
        style: 'tower',
        coolingCap: 200,
        watt: 10,
        price: 2100,
        desc: 'ซิงก์ลมทาวเวอร์คู่ 6 ท่อทองแดง พัดลมคู่แรงลมสูง รับมือซีพียูระดับ i7 / Ryzen 9 ได้ในราคาประหยัดกว่าชุดน้ำ',
        tip: 'หากใช้ซิงก์ลมขนาดใหญ่ ควรติดแรมก่อนวางซิงก์ เพื่อไม่ให้ตัวซิงก์บังช่องเสียบแรม'
      },
      {
        id: 'cool_aio',
        cat: 'cooler',
        name: 'CryoBit 240mm Liquid AIO',
        short: 'Liquid AIO (TDP 260W)',
        style: 'aio',
        coolingCap: 260,
        watt: 15,
        price: 3500,
        desc: 'ชุดระบายความร้อนด้วยน้ำระบบปิด (All-in-One) พร้อมหม้อน้ำ 240mm เหมาะสำหรับซีพียูตัวท็อปที่ความร้อนสูง',
        tip: 'ลอกแผ่นพลาสติกใสใต้หน้าสัมผัสทองแดงของปั๊มน้ำออกก่อนติดตั้งเสมอ!'
      }
    ],
    ram: [
      {
        id: 'ram_16_d4',
        cat: 'ram',
        name: 'BitRAM 16GB (2×8GB) DDR4',
        short: '16GB DDR4-3200',
        ramType: 'DDR4',
        capacity: 16,
        rgb: false,
        watt: 8,
        price: 1400,
        office: 85, gaming: 80, work: 68,
        desc: 'หน่วยความจำหลัก 16GB แบบ 2 แถว (Dual Channel) มาตรฐานสำหรับเรียน ทำงาน และเล่นเกมทั่วไป',
        tip: 'ติดตั้งแรม 2 แถวที่สล็อต A2 และ B2 (เว้นสล็อตสลับกัน) เพื่อเปิดใช้งาน Dual Channel เพิ่มแบนด์วิดท์ 2 เท่า!'
      },
      {
        id: 'ram_32_d4',
        cat: 'ram',
        name: 'BitRAM 32GB (2×16GB) DDR4',
        short: '32GB DDR4-3600',
        ramType: 'DDR4',
        capacity: 32,
        rgb: true,
        watt: 10,
        price: 2600,
        office: 95, gaming: 88, work: 86,
        desc: 'แรม 32GB DDR4 ความจุสูง รองรับการเปิดแท็บเบราว์เซอร์จำนวนมาก ตัดต่อวิดีโอ และรันโปรแกรมจำลองได้สบาย',
        tip: 'กดแรมลงตรงๆ จนตัวล็อกด้านข้างดีดกลับดัง "คลิก!" หากเสียบไม่สนิทเครื่องจะเปิดไม่ติดและมีเสียง Beep 3 ครั้ง'
      },
      {
        id: 'ram_16_d5',
        cat: 'ram',
        name: 'HyperPix 16GB (2×8GB) DDR5',
        short: '16GB DDR5-5600',
        ramType: 'DDR5',
        capacity: 16,
        rgb: false,
        watt: 10,
        price: 2400,
        office: 90, gaming: 86, work: 76,
        desc: 'แรม DDR5 ความจุเริ่มต้น 16GB แบบ Dual Channel สำหรับคอมพิวเตอร์ยุคใหม่ในงบประหยัด',
        tip: 'แรม DDR5 มีชิปควบคุมแรงดันไฟ (PMIC) อยู่บนแผงแรมโดยตรงและมีร่องบากต่างจาก DDR4'
      },
      {
        id: 'ram_32_d5',
        cat: 'ram',
        name: 'HyperPix 32GB (2×16GB) DDR5',
        short: '32GB DDR5-6000 RGB',
        ramType: 'DDR5',
        capacity: 32,
        rgb: true,
        watt: 12,
        price: 4200,
        office: 98, gaming: 95, work: 92,
        desc: 'แรม DDR5 ความเร็วสูง 6000 MT/s พร้อมไฟ RGB แบนด์วิดท์กว้างกว่า DDR4 ช่วยรีดเฟรมเรตเกมและงานตัดต่อ',
        tip: 'แรม DDR5 ใช้ได้เฉพาะเมนบอร์ดที่รองรับ DDR5 เท่านั้น ตรวจสอบร่องบากก่อนกดลงสล็อต'
      },
      {
        id: 'ram_64_d5',
        cat: 'ram',
        name: 'HyperPix 64GB (2×32GB) DDR5',
        short: '64GB DDR5-6400 RGB',
        ramType: 'DDR5',
        capacity: 64,
        rgb: true,
        watt: 16,
        price: 8500,
        office: 100, gaming: 98, work: 100,
        desc: 'แรมความจุระดับมืออาชีพ 64GB DDR5 สำหรับงานเรนเดอร์ 3D ตัดต่อวิดีโอ 4K/8K และงานวิจัย AI',
        tip: 'เปิด XMP / EXPO ในหน้า BIOS หลังประกอบเสร็จ เพื่อให้แรมวิ่งเต็มความเร็วสเปก'
      }
    ],
    ssd: [
      {
        id: 'ssd_500',
        cat: 'ssd',
        name: 'FlashBit 500GB NVMe Gen4',
        short: '500GB M.2 NVMe',
        capacityGB: 500,
        watt: 5,
        price: 1350,
        desc: 'หน่วยเก็บข้อมูลแบบ M.2 NVMe SSD ความเร็วสูง บูตระบบปฏิบัติการและเปิดโปรแกรมได้ในไม่กี่วินาที',
        tip: 'เสียบ M.2 SSD ทำมุมประมาณ 30 องศาเข้าสล็อต จากนั้นกดปลายลงแล้วขันน็อตตัวจิ๋วยึดให้แน่น'
      },
      {
        id: 'ssd_1tb',
        cat: 'ssd',
        name: 'FlashBit 1TB NVMe Gen4 Pro',
        short: '1TB M.2 NVMe Pro',
        capacityGB: 1000,
        watt: 6,
        price: 2450,
        desc: 'M.2 NVMe ความจุ 1TB อ่านข้อมูลเร็ว 7,000 MB/s พื้นที่เหลือเฟือสำหรับลงเกมยุคใหม่และไฟล์โปรเจกต์',
        tip: 'NVMe SSD ไม่ต้องเสียบสายไฟหรือสาย SATA ให้เกะกะ เพราะรับไฟและส่งข้อมูลผ่านสล็อต M.2 โดยตรง'
      },
      {
        id: 'ssd_2tb',
        cat: 'ssd',
        name: 'TurboPix 2TB NVMe Gen5',
        short: '2TB M.2 Gen5 Heatsink',
        capacityGB: 2000,
        watt: 8,
        price: 5200,
        desc: 'SSD ความเร็วสูงสุด 2TB พร้อมซิงก์ระบายความร้อนในตัว สำหรับไฟล์วิดีโอ 4K และชุดข้อมูล AI ขนาดใหญ่',
        tip: 'ติดตั้ง SSD ในสล็อต M.2 ช่องแรกใกล้ CPU ที่สุด เพื่อให้วิ่งตรงผ่านเลน PCIe ของซีพียู'
      },
      {
        id: 'ssd_4tb',
        cat: 'ssd',
        name: 'TurboPix 4TB NVMe Gen5 Extreme',
        short: '4TB M.2 Gen5 Extreme',
        capacityGB: 4000,
        watt: 10,
        price: 9800,
        desc: 'หน่วยเก็บข้อมูลระดับสตูดิโอความจุยักษ์ 4TB เก็บฟุตเทจภาพยนตร์ 8K เกมระดับ AAA และโมเดล AI ได้หลายสิบโปรเจกต์',
        tip: 'SSD ความเร็ว Gen5 มักเกิดความร้อนสูงขณะเขียนไฟล์หนักๆ ควรใช้ร่วมกับแผ่นระบายความร้อน M.2 Heatsink ของเมนบอร์ด'
      }
    ],
    gpu: [
      {
        id: 'gpu_gt1030',
        cat: 'gpu',
        name: 'PixGT 1030 4GB Office',
        short: 'PixGT 1030 (45W)',
        watt: 45,
        price: 1900,
        fans: 1,
        color: '#334155',
        accent: '#38bdf8',
        office: 82, gaming: 42, work: 40,
        desc: 'การ์ดจอขนาดกะทัดรัด ประหยัดไฟ รองรับการต่อหน้าจอ 4K สำหรับงานเอกสาร ดูสื่อการสอน และกราฟิกเบื้องต้น',
        tip: 'เสียบการ์ดจอลงสล็อต PCIe x16 แถวบนสุดจนสลักล็อกดังคลิก และอย่าลืมต่อสายไฟเลี้ยง PCIe'
      },
      {
        id: 'gpu_rx6600',
        cat: 'gpu',
        name: 'RadeonPix RX 6600 8GB',
        short: 'RX 6600 8GB (130W)',
        watt: 130,
        price: 6900,
        fans: 2,
        color: '#2b1d28',
        accent: '#f43f5e',
        office: 90, gaming: 78, work: 70,
        desc: 'การ์ดจอเกมมิ่งสายคุ้มค่าราคาประหยัด เล่นเกม 1080p ลื่นไหลเกือบทุกเกมและกินไฟต่ำเพียง 130W',
        tip: 'ตรวจสอบขนาดความยาวของการ์ดจอก่อนประกอบจริงว่าใส่เข้าเคสได้พอดีไม่ชนพัดลมหน้าเคส'
      },
      {
        id: 'gpu_4060',
        cat: 'gpu',
        name: 'PixForce RTX 4060 8GB',
        short: 'RTX 4060 8GB (115W)',
        watt: 115,
        price: 10500,
        fans: 2,
        color: '#1e293b',
        accent: '#4ade80',
        office: 95, gaming: 86, work: 78,
        desc: 'การ์ดจอเกมมิ่ง 1080p สุดคุ้ม กินไฟน้อย รองรับ Ray Tracing และ AI Upscaling เล่นเกมยุคใหม่ได้ลื่น',
        tip: 'เสียบสายไฟ PCIe 8-Pin จาก PSU เข้าที่ตัวการ์ดจอให้สุด มิฉะนั้นเครื่องจะไม่มีภาพขึ้นหน้าจอ'
      },
      {
        id: 'gpu_rx7800xt',
        cat: 'gpu',
        name: 'RadeonPix RX 7800 XT 16GB',
        short: 'RX 7800XT 16GB (260W)',
        watt: 260,
        price: 17500,
        fans: 3,
        color: '#1f1726',
        accent: '#fb7185',
        office: 97, gaming: 92, work: 88,
        desc: 'การ์ดจอ VRAM 16GB คุ้มค่าสุดสำหรับเกม 1440p และงานสตรีมมิ่งตัดต่อที่ต้องการหน่วยความจำการ์ดจอสูง',
        tip: 'การ์ดจอ 3 พัดลมที่มีความยาวมาก ควรใช้แท่นค้ำการ์ดจอเพื่อป้องกันสล็อต PCIe แอ่นในระยะยาว'
      },
      {
        id: 'gpu_4070s',
        cat: 'gpu',
        name: 'PixForce RTX 4070 Super 12GB',
        short: 'RTX 4070S 12GB (220W)',
        watt: 220,
        price: 21900,
        fans: 2,
        color: '#1f2937',
        accent: '#a78bfa',
        office: 98, gaming: 94, work: 92,
        desc: 'การ์ดจอระดับสูง VRAM 12GB ลื่นไหลทั้งเกม 1440p และงานเรนเดอร์ 3D / ตัดต่อวิดีโอระดับมืออาชีพ',
        tip: 'การ์ดจอที่กินไฟ 220W+ ควรใช้พาวเวอร์ซัพพลายมาตรฐาน 650W–750W ขึ้นไปเพื่อความเสถียร'
      },
      {
        id: 'gpu_4090',
        cat: 'gpu',
        name: 'TitanBit RTX 4090 24GB',
        short: 'RTX 4090 24GB (420W)',
        watt: 420,
        price: 36000,
        fans: 3,
        color: '#111827',
        accent: '#fbbf24',
        office: 100, gaming: 100, work: 100,
        desc: 'ที่สุดของการ์ดจอ 3 พัดลม VRAM 24GB พลังประมวลผลกราฟิก 4K และเทรนโมเดล AI ได้รวดเร็วระดับสุดยอด',
        tip: 'การ์ดจอรุ่นใหญ่กินไฟสูงมาก (420W) ต้องจับคู่กับ PSU 850W–1000W และเคสที่มี Airflow ดีเยี่ยม'
      }
    ],
    psu: [
      {
        id: 'psu_500',
        cat: 'psu',
        name: 'VoltBit 500W 80+ White',
        short: '500W 80+ White',
        capacity: 500,
        price: 1300,
        desc: 'พาวเวอร์ซัพพลาย 500W มาตรฐาน 80 Plus เหมาะสำหรับคอมพิวเตอร์สำนักงานและสเปกประหยัดพลังงาน',
        tip: 'ติดตั้ง PSU ด้านล่างเคสให้พัดลมดูดอากาศเย็นจากช่องตะแกรงด้านล่าง และอย่าลืมเปิดสวิตช์ I/O ด้านหลัง!'
      },
      {
        id: 'psu_650',
        cat: 'psu',
        name: 'VoltBit 650W 80+ Bronze',
        short: '650W 80+ Bronze',
        capacity: 650,
        price: 2100,
        desc: 'พาวเวอร์ซัพพลาย 650W จ่ายไฟนิ่ง มีระบบป้องกันไฟเกิน เหมาะสำหรับคอมเกมมิ่งระดับกลาง',
        tip: 'ควรเลือก PSU ที่มีกำลังวัตต์สูงกว่ากำลังไฟรวมของระบบอย่างน้อย 20–30% เพื่อความทนทานและประสิทธิภาพสูงสุด'
      },
      {
        id: 'psu_750',
        cat: 'psu',
        name: 'VoltBit 750W 80+ Gold',
        short: '750W 80+ Gold Modular',
        capacity: 750,
        price: 3400,
        desc: 'พาวเวอร์ซัพพลาย 750W ประสิทธิภาพสูง 80+ Gold ถอดสายได้ ช่วยจัดสายไฟในเคสให้เป็นระเบียบ',
        tip: 'สาย 24-Pin จ่ายไฟให้เมนบอร์ด, สาย 8-Pin CPU จ่ายไฟให้ซีพียู และสาย 8-Pin PCIe จ่ายไฟให้การ์ดจอ ห้ามสลับกัน!'
      },
      {
        id: 'psu_850',
        cat: 'psu',
        name: 'VoltBit 850W 80+ Gold ATX 3.0',
        short: '850W 80+ Gold ATX 3.0',
        capacity: 850,
        price: 4300,
        desc: 'พาวเวอร์ซัพพลายมาตรฐานใหม่ ATX 3.0 จ่ายไฟสูงถึง 850W รองรับไฟกระชากของการ์ดจอระดับ High-End ได้สบาย',
        tip: 'มาตรฐาน ATX 3.0 รองรับไฟกระชาก (Power Excursion) ได้สูงสุดถึง 200% ในเสี้ยววินาที'
      },
      {
        id: 'psu_1000',
        cat: 'psu',
        name: 'VoltBit 1000W 80+ Platinum',
        short: '1000W 80+ Platinum',
        capacity: 1000,
        price: 5800,
        desc: 'พาวเวอร์ซัพพลาย 1000W ระดับเรือธง จ่ายไฟเสถียรสูงสุด รองรับการ์ดจอ RTX 4090 และซีพียู Workstation สบายๆ',
        tip: 'ห้ามเปิดฝาแกะภายในตัว PSU เองเด็ดขาด เพราะมีตัวเก็บประจุไฟฟ้าแรงสูงค้างอยู่แม้ถอดปลั๊กแล้ว'
      }
    ]
  };

  function getPartById(id) {
    for (const key of Object.keys(CATALOG)) {
      const found = CATALOG[key].find((p) => p.id === id);
      if (found) return found;
    }
    return null;
  }

  // Default balanced build for Modes 1 & 2
  const DEFAULT_BUILD = {
    mb: 'mb_b760',
    cpu: 'cpu_i5',
    cooler: 'cool_tower',
    ram: 'ram_32_d4',
    ssd: 'ssd_1tb',
    gpu: 'gpu_4060',
    psu: 'psu_650'
  };

  // 3-Tier Classroom Difficulty Levels
  const DIFFICULTIES = {
    easy: {
      id: 'easy',
      name: 'ง่าย (ผู้เริ่มต้น)',
      badge: 'EASY',
      hints: 99,
      alwaysHighlight: true,
      pasteMin: 35,
      pasteMax: 78,
      errorPenalty: 2,
      gradeSTime: 300
    },
    normal: {
      id: 'normal',
      name: 'ปานกลาง (มาตรฐาน)',
      badge: 'NORMAL',
      hints: 3,
      alwaysHighlight: false,
      pasteMin: 44,
      pasteMax: 68,
      errorPenalty: 5,
      gradeSTime: 240
    },
    hard: {
      id: 'hard',
      name: 'ยาก (สอบปฏิบัติ)',
      badge: 'HARD',
      hints: 0,
      alwaysHighlight: false,
      hideSelectHighlight: true,
      pasteMin: 48,
      pasteMax: 62,
      errorPenalty: 10,
      gradeSTime: 150
    }
  };

  // 12 Realistic Assembly Steps
  const STEPS = [
    {
      id: 'mb',
      title: '1. ติดตั้งเมนบอร์ด (Motherboard)',
      zone: 'mb',
      itemId: 'mb',
      tab: 'parts',
      mentor: 'เริ่มขั้นตอนที่ 1 กันเลย! เลือก "เมนบอร์ด" ทางซ้าย แล้วคลิกวางลงบนหมุดรอง (Standoffs) กลางเคส',
      doneMsg: 'เยี่ยมมาก! เมนบอร์ดยึดเข้ากับหมุดรองและขันน็อตครบเรียบร้อย เป็นศูนย์กลางเชื่อมต่อทุกอุปกรณ์'
    },
    {
      id: 'cpu',
      title: '2. วางซีพียูลงซ็อกเก็ต (CPU)',
      zone: 'cpu',
      itemId: 'cpu',
      tab: 'parts',
      mentor: 'ขั้นที่ 2: เลือก "CPU" แล้ววางลงในซ็อกเก็ตบนเมนบอร์ด ให้มุมสามเหลี่ยมสีทองตรงกันพอดีนะ!',
      doneMsg: 'ลงล็อกเป๊ะ! ซีพียูคือ "สมองของคอมพิวเตอร์" ตอนนี้ปิดสลักล็อกซ็อกเก็ตเรียบร้อยแล้ว'
    },
    {
      id: 'paste',
      title: '3. ทาซิลิโคนระบายความร้อน (Thermal Paste)',
      zone: 'cpu',
      itemId: 'tool_paste',
      tab: 'tools',
      mentor: 'ขั้นที่ 3 สำคัญมาก! สลับไปแท็บ "ซิลิโคน & สายไฟ" เลือก "หลอดซิลิโคน" แล้วคลิกที่ CPU เพื่อหยอดขนาดเม็ดถั่วเขียว',
      doneMsg: 'ซิลิโคนช่วยเชื่อมช่องว่างขนาดเล็กจิ๋วระหว่าง CPU กับซิงก์ ทำให้นำความร้อนได้ดีขึ้นมาก!'
    },
    {
      id: 'cooler',
      title: '4. ติดตั้งชุดระบายความร้อน (CPU Cooler)',
      zone: 'cpu',
      itemId: 'cooler',
      tab: 'parts',
      mentor: 'ขั้นที่ 4: เลือก "ชุดระบายความร้อน CPU Cooler" แล้ววางทับบน CPU ที่ทาซิลิโคนไว้ได้เลย',
      doneMsg: 'ติดตั้งซิงก์ระบายความร้อนเรียบร้อย! เดี๋ยวอย่าลืมเสียบสายพัดลม CPU_FAN ในขั้นตอนเดินสายไฟนะ'
    },
    {
      id: 'ram',
      title: '5. เสียบแรมแบบ Dual Channel (A2/B2)',
      zone: 'ram',
      itemId: 'ram',
      tab: 'parts',
      mentor: 'ขั้นที่ 5: เลือก "แรม (RAM)" แล้วคลิกติดตั้งที่สล็อตแรมสีฟ้า (ช่อง A2 และ B2) เพื่อให้ทำงานแบบ Dual Channel',
      doneMsg: 'คลิก! แรม 2 แถวทำงานแบบ Dual Channel เพิ่มความเร็วรับส่งข้อมูลเป็น 2 เท่า!'
    },
    {
      id: 'ssd',
      title: '6. ติดตั้ง M.2 NVMe SSD',
      zone: 'ssd',
      itemId: 'ssd',
      tab: 'parts',
      mentor: 'ขั้นที่ 6: เลือก "M.2 NVMe SSD" แล้วติดตั้งลงสล็อต M.2 ใต้ซ็อกเก็ต CPU เพื่อเก็บระบบปฏิบัติการและข้อมูล',
      doneMsg: 'เรียบร้อย! M.2 NVMe SSD ยึดน็อตแน่นหนา รอรับการบูตระบบปฏิบัติการความเร็วสูง'
    },
    {
      id: 'psu',
      title: '7. ติดตั้งพาวเวอร์ซัพพลาย (PSU)',
      zone: 'psu',
      itemId: 'psu',
      tab: 'parts',
      mentor: 'ขั้นที่ 7: เลือก "พาวเวอร์ซัพพลาย (PSU)" วางลงในช่องด้านล่างซ้ายของเคส เพื่อเป็นแหล่งจ่ายไฟหลัก',
      doneMsg: 'ติดตั้ง PSU สำเร็จ! พาวเวอร์ซัพพลายจะแปลงไฟบ้าน AC เป็นไฟ DC จ่ายให้ทุกชิ้นส่วนอย่างปลอดภัย'
    },
    {
      id: 'cables_main',
      title: '8. เดินสายไฟหลัก (24-Pin, 8-Pin CPU, CPU_FAN)',
      zone: 'cables',
      itemId: 'cable_24',
      tab: 'tools',
      mentor: 'ขั้นที่ 8: ไปแท็บ "ซิลิโคน & สายไฟ" แล้วเสียบสายไฟหลักให้ครบ 3 เส้น: สาย 24-Pin ATX, สาย 8-Pin CPU และสายพัดลม CPU_FAN!',
      doneMsg: 'เดินสายไฟเมนบอร์ดและพัดลม CPU ครบทุกเส้นแล้ว! จัดสายเรียบร้อยสวยงามมาก'
    },
    {
      id: 'gpu',
      title: '9. ติดตั้งการ์ดจอ (GPU) + สายไฟ PCIe',
      zone: 'gpu',
      itemId: 'gpu',
      tab: 'parts',
      mentor: 'ขั้นที่ 9: เลือก "การ์ดจอ (GPU)" เสียบลงสล็อต PCIe x16 จากนั้นไปเสียบ "สายไฟ 8-Pin PCIe GPU" ด้วยนะ!',
      doneMsg: 'ติดตั้งการ์ดจอและต่อไฟเลี้ยง PCIe เรียบร้อย พร้อมประมวลผลภาพกราฟิกแล้ว!'
    },
    {
      id: 'fans',
      title: '10. ติดตั้งพัดลมเคส (Case Airflow Fans)',
      zone: 'fans',
      itemId: 'fans',
      tab: 'parts',
      mentor: 'ขั้นที่ 10: เลือก "ชุดพัดลมเคส (Intake/Exhaust)" ติดตั้งด้านหน้าและด้านหลังเคส เพื่อสร้างทิศทางลม Airflow ที่ดี',
      doneMsg: 'ยอดเยี่ยม! ลมเย็นเข้าด้านหน้า → ผ่าน CPU/GPU → ลมร้อนออกด้านหลัง ลองกดปุ่ม "💨 Airflow" ดูทิศทางลมได้!'
    },
    {
      id: 'psu_on',
      title: '11. ปิดฝาเคส & เปิดสวิตช์ PSU (I)',
      zone: 'switch',
      itemId: 'psu_switch',
      tab: 'parts',
      mentor: 'ขั้นที่ 11: กดปุ่ม "🪟 ฝาข้าง" เพื่อปิดกระจก (ทางเลือก) และกดปุ่ม "⚡ สวิตช์ PSU" ด้านล่างจอให้เป็น ON (I)',
      doneMsg: 'สวิตช์พาวเวอร์ซัพพลายเปิด (I) แล้ว! ไฟสแตนด์บายเข้าสู่เมนบอร์ดเรียบร้อย'
    },
    {
      id: 'power',
      title: '12. กดปุ่ม Power ทดสอบบูต BIOS / POST',
      zone: 'power',
      itemId: 'power_btn',
      tab: 'parts',
      mentor: 'ขั้นสุดท้าย! กดปุ่มสีเขียว "⏻ กดปุ่มเปิดเครื่อง" เพื่อทดสอบ POST และเข้าสู่หน้าจอ BIOS!',
      doneMsg: 'ยินดีด้วย!! เครื่องผ่านการทดสอบ POST และบูตเข้าสู่ระบบสำเร็จสมบูรณ์!'
    }
  ];

  // Mode 3: 5 Budget & Compatibility Missions
  const MISSIONS = [
    {
      id: 'm1',
      num: 'MISSION 1',
      title: 'คอมสำนักงาน & เรียนออนไลน์',
      clientName: 'น้องพลอย (นักเรียน ม.ปลาย)',
      avatarType: 'student',
      budget: 15000,
      story: 'หนูอยากได้คอมพิวเตอร์ไว้ทำรายงาน เรียนออนไลน์ และเขียนโปรแกรมเบื้องต้น งบประหยัดไม่เกิน 15,000 บาท ขออุปกรณ์เข้ากันได้ครบทุกชิ้นนะคะ!',
      reqs: { office: 75, gaming: 0, work: 0, minRam: 16, minSsd: 500, requireDdr5: false },
      reqLabels: ['งบ ≤ ฿15,000', 'งานเอกสาร ≥ 75', 'RAM ≥ 16GB', 'อุปกรณ์เข้ากันได้ 100%'],
      defaultConfig: { mb: 'mb_b760', cpu: 'cpu_i3', cooler: 'cool_stock', ram: 'ram_16_d4', ssd: 'ssd_500', gpu: 'gpu_gt1030', psu: 'psu_500' }
    },
    {
      id: 'm2',
      num: 'MISSION 2',
      title: 'คอมเกมมิ่ง E-Sports 1080p',
      clientName: 'พี่บอส (เกมเมอร์สตรีมเมอร์)',
      avatarType: 'gamer',
      budget: 29000,
      story: 'พี่อยากจัดสเปกเล่นเกม E-Sports และเกม AAA ภาพสวยๆ ลื่นๆ ที่ 1080p ขอการ์ดจอแรงพอสมควร งบไม่เกิน 29,000 บาท อย่าลืมดูไฟ PSU ด้วยนะ!',
      reqs: { office: 80, gaming: 80, work: 0, minRam: 16, minSsd: 1000, requireDdr5: false },
      reqLabels: ['งบ ≤ ฿29,000', 'เกมมิ่ง ≥ 80', 'SSD ≥ 1TB', 'PSU เพียงพอ'],
      defaultConfig: { mb: 'mb_b760', cpu: 'cpu_i3', cooler: 'cool_stock', ram: 'ram_16_d4', ssd: 'ssd_500', gpu: 'gpu_gt1030', psu: 'psu_500' }
    },
    {
      id: 'm3',
      num: 'MISSION 3',
      title: 'สายโค้ดดิ้ง & มัลติทาสก์ DDR5',
      clientName: 'ครูต้น (อาจารย์คอมพิวเตอร์)',
      avatarType: 'teacher',
      budget: 34500,
      story: 'ครูต้องการเครื่องใหม่ใช้สอนเขียนโปรแกรม รันจำลองเซิร์ฟเวอร์ และตัดต่อสื่อการสอน ขอใช้เทคโนโลยีแรม DDR5 ขนาด 32GB ในงบ 34,500 บาท',
      reqs: { office: 90, gaming: 0, work: 75, minRam: 32, minSsd: 1000, requireDdr5: true },
      reqLabels: ['งบ ≤ ฿34,500', 'ต้องใช้ DDR5 ≥ 32GB', 'งานตัดต่อ/โค้ด ≥ 75', 'SSD ≥ 1TB'],
      defaultConfig: { mb: 'mb_b760', cpu: 'cpu_r5', cooler: 'cool_stock', ram: 'ram_16_d4', ssd: 'ssd_500', gpu: 'gpu_4060', psu: 'psu_500' }
    },
    {
      id: 'm4',
      num: 'MISSION 4',
      title: 'เครื่องตัดต่อวิดีโอ & กราฟิก 3D',
      clientName: 'คุณมายด์ (ครีเอเตอร์สายตัดต่อ)',
      avatarType: 'creator',
      budget: 48000,
      story: 'ต้องตัดต่อวิดีโอ 4K และเรนเดอร์โมเดล 3D ทุกวัน อยากได้สเปกแรงๆ แรมอย่างน้อย 32GB การ์ดจอ VRAM เยอะๆ งบไม่เกิน 48,000 บาทค่ะ',
      reqs: { office: 90, gaming: 80, work: 85, minRam: 32, minSsd: 1000, requireDdr5: false },
      reqLabels: ['งบ ≤ ฿48,000', 'งานตัดต่อ/3D ≥ 85', 'RAM ≥ 32GB', 'SSD ≥ 1TB'],
      defaultConfig: { mb: 'mb_b650', cpu: 'cpu_r5', cooler: 'cool_stock', ram: 'ram_32_d5', ssd: 'ssd_500', gpu: 'gpu_4060', psu: 'psu_500' }
    },
    {
      id: 'm5',
      num: 'MISSION 5',
      title: 'สุดยอดเกมมิ่ง 4K & AI Workstation',
      clientName: 'ดร.เนโอ (นักวิจัย AI)',
      avatarType: 'scientist',
      budget: 86000,
      story: 'ผมต้องการเครื่องระดับท็อปสุดสำหรับเทรนโมเดล AI และทดสอบกราฟิก 4K ต้องมีชุดระบายความร้อนที่เอา CPU อยู่และ PSU จ่ายไฟพอแน่นอน!',
      reqs: { office: 95, gaming: 96, work: 96, minRam: 32, minSsd: 2000, requireDdr5: true },
      reqLabels: ['งบ ≤ ฿86,000', 'เกมมิ่ง ≥ 96', 'AI/Work ≥ 96', 'SSD ≥ 2TB + DDR5'],
      defaultConfig: { mb: 'mb_b650', cpu: 'cpu_r9', cooler: 'cool_stock', ram: 'ram_32_d5', ssd: 'ssd_1tb', gpu: 'gpu_4090', psu: 'psu_650' }
    },
    {
      id: 'm6',
      num: 'MISSION 6',
      title: 'อัปเกรดเกมมิ่งสุดคุ้มสายประหยัด AM4',
      clientName: 'น้องภูมิ (นักศึกษาสายคุ้ม)',
      avatarType: 'student',
      budget: 21000,
      story: 'ผมมีงบ 21,000 บาท อยากประกอบคอมเล่นเกม 1080p ที่คุ้มค่าที่สุดบนแพลตฟอร์มซ็อกเก็ต AM4 ของค่ายแดง ช่วยจัดสเปกให้หน่อยครับ!',
      reqs: { office: 80, gaming: 74, work: 0, minRam: 16, minSsd: 500, requireDdr5: false, requireSocket: 'AM4' },
      reqLabels: ['งบ ≤ ฿21,000', 'ต้องใช้ซ็อกเก็ต AM4', 'เกมมิ่ง ≥ 74', 'RAM ≥ 16GB'],
      defaultConfig: { mb: 'mb_b550', cpu: 'cpu_r5_5600', cooler: 'cool_stock', ram: 'ram_16_d4', ssd: 'ssd_500', gpu: 'gpu_gt1030', psu: 'psu_500' }
    },
    {
      id: 'm7',
      num: 'MISSION 7',
      title: 'สตรีมเมอร์เกมมิ่ง 1440p เฟรมเรตสูง',
      clientName: 'คุณแชมป์ (Pro Streamer)',
      avatarType: 'gamer',
      budget: 58000,
      story: 'อยากได้คอมสตรีมเกมระดับ 1440p ที่เฟรมเรตลื่นหัวแตกพร้อมทำงานตัดต่อไฮไลต์ไปด้วย ต้องใช้แรม DDR5 32GB ขึ้นไปในงบ 58,000 บาท!',
      reqs: { office: 92, gaming: 92, work: 86, minRam: 32, minSsd: 1000, requireDdr5: true },
      reqLabels: ['งบ ≤ ฿58,000', 'เกมมิ่ง ≥ 92', 'งานสตรีม/ตัดต่อ ≥ 86', 'DDR5 ≥ 32GB'],
      defaultConfig: { mb: 'mb_b650', cpu: 'cpu_r7_7800x3d', cooler: 'cool_stock', ram: 'ram_16_d5', ssd: 'ssd_1tb', gpu: 'gpu_4060', psu: 'psu_650' }
    },
    {
      id: 'm8',
      num: 'MISSION 8',
      title: 'สตูดิโอภาพยนตร์ 8K & คลังข้อมูล 4TB',
      clientName: 'ผกก.ก้อง (Film Director)',
      avatarType: 'creator',
      budget: 96000,
      story: 'กองถ่ายเราต้องการเครื่อง Workstation ตัดต่อฟุตเทจ 8K และเรนเดอร์ VFX ขอ RAM 64GB DDR5 และพื้นที่เก็บข้อมูล NVMe 4TB ในงบ 96,000 บาท!',
      reqs: { office: 96, gaming: 96, work: 96, minRam: 64, minSsd: 4000, requireDdr5: true },
      reqLabels: ['งบ ≤ ฿96,000', 'RAM 64GB DDR5', 'SSD 4TB', 'ตัดต่อ/AI ≥ 96'],
      defaultConfig: { mb: 'mb_z790', cpu: 'cpu_i7', cooler: 'cool_tower', ram: 'ram_32_d5', ssd: 'ssd_2tb', gpu: 'gpu_4070s', psu: 'psu_750' }
    }
  ];

  // Mode 4: 8 Troubleshooting Lab Cases
  const TROUBLESHOOT_CASES = [
    {
      id: 't1',
      num: 'CASE 01',
      title: 'กดเปิดเครื่องแล้วเงียบสนิท ไม่มีไฟเลย!',
      difficulty: 'ง่าย',
      symptom: 'ลูกค้าบอกว่าประกอบเสร็จหมดแล้ว เสียบปลั๊กไฟบ้านแล้ว แต่กดปุ่ม Power หน้าเคสกี่ครั้งก็เงียบสนิท พัดลมไม่หมุน ไฟไม่ติดเลย',
      clue: 'ลองสังเกตด้านหลังพาวเวอร์ซัพพลาย (PSU) และสายไฟหลัก 24-Pin ATX',
      faults: { psuSwitch: false, cable24: false },
      explanation: 'ปัญหาเปิดไม่ติดพบบ่อยที่สุดคือ "ลืมเปิดสวิตช์ I/O หลัง PSU" หรือ "เสียบสาย 24-Pin ATX ไม่แน่น/ลืมเสียบ" ทำให้ไฟไม่เข้าเมนบอร์ด'
    },
    {
      id: 't2',
      num: 'CASE 02',
      title: 'เครื่องติดแต่จอมืด มีเสียงดัง "ปี๊บ-ปี๊บ-ปี๊บ" 3 ครั้ง',
      difficulty: 'ปานกลาง',
      symptom: 'พัดลมหมุนปกติ ไฟ RGB ติด แต่หน้าจอมืดสนิท และเมนบอร์ดส่งเสียง Beep Code สั้นๆ 3 ครั้ง (3 Short Beeps)',
      clue: 'เสียง Beep สั้น 3 ครั้งในระบบ POST มักหมายถึงปัญหาที่หน่วยความจำหลัก (Memory/RAM)',
      faults: { ramMissing: true },
      explanation: 'POST Beep สั้น 3 ครั้ง บ่งบอกว่าตรวจไม่พบ RAM หรือเสียบแรมไม่แน่นสนิท วิธีแก้คือติดตั้งแรมให้ลงล็อกช่อง A2/B2 จนดังคลิก'
    },
    {
      id: 't3',
      num: 'CASE 03',
      title: 'เปิดได้แป๊บเดียว CPU ร้อนพุ่ง 98°C แล้วเครื่องดับ!',
      difficulty: 'ปานกลาง',
      symptom: 'เครื่องบูตติดแต่พัดลมร้องเสียงดังมาก หน้า BIOS แจ้งเตือน CPU Over Temperature Error! อุณหภูมิพุ่งเกือบ 100°C',
      clue: 'ตรวจสอบการระบายความร้อนของ CPU — ทาซิลิโคนหรือยัง? เสียบสายพัดลม CPU_FAN หรือยัง?',
      faults: { noPaste: true, cableFan: false },
      explanation: 'หากลืมทาซิลิโคน (Thermal Paste) หรือลืมเสียบสายพัดลม CPU_FAN ความร้อนจะไม่สามารถถ่ายเทออกจาก CPU ได้จนเกิด Overheat Shutdown'
    },
    {
      id: 't4',
      num: 'CASE 04',
      title: 'พัดลมหมุนทุกตัว แต่ไม่มีภาพออกจอ + Beep ยาว 1 สั้น 2',
      difficulty: 'ปานกลาง',
      symptom: 'เครื่องทำงานปกติแต่จอมืดขึ้น "No Signal" มีเสียงเตือน POST ยาว 1 ครั้ง สั้น 2 ครั้ง (1 Long, 2 Short Beeps)',
      clue: 'เสียงเตือน 1 ยาว 2 สั้น เป็นรหัสของระบบแสดงผล (GPU / VGA) ลองเช็กสายไฟเลี้ยงการ์ดจอ!',
      faults: { cableGpu: false },
      explanation: 'การ์ดจอแยกที่ต้องการไฟเลี้ยงเสริมต้องเสียบสาย PCIe 8-Pin จาก PSU ให้ครบ หากลืมเสียบการ์ดจอจะไม่ทำงานและไม่มีภาพออกจอ'
    },
    {
      id: 't5',
      num: 'CASE 05',
      title: 'เข้าหน้า BIOS ได้ แต่ขึ้น "No Bootable Device Found"',
      difficulty: 'ท้าทาย',
      symptom: 'เครื่องผ่าน POST ทุกอย่าง หน้าจอติด อุณหภูมิปกติ แรมครบ แต่บูตเข้า Windows/Pixel OS ไม่ได้ ขึ้นแจ้งว่าไม่พบไดรฟ์ระบบ!',
      clue: 'ตรวจเช็กสาย 8-Pin CPU และตรวจสอบว่ามีหน่วยเก็บข้อมูล M.2 NVMe SSD ติดตั้งบนเมนบอร์ดหรือยัง',
      faults: { ssdMissing: true },
      explanation: 'เมื่อไม่มี SSD/HDD ที่ติดตั้งระบบปฏิบัติการ หรือเสียบไม่สนิท เมนบอร์ดจะบูตค้างที่หน้า BIOS และแจ้ง "No Bootable Device Found"'
    },
    {
      id: 't6',
      num: 'CASE 06',
      title: 'พัดลมหมุนแต่ไฟ CPU_LED แดงค้าง บูตไม่เข้า POST',
      difficulty: 'ปานกลาง',
      symptom: 'กดปุ่ม Power แล้วพัดลมหมุนทุกตัว ไฟ RGB ติด แต่หน้าจอไม่ขึ้นอะไรเลยและไฟสถานะ CPU_LED บนเมนบอร์ดติดสีแดงค้าง!',
      clue: 'ไฟ CPU_LED สีแดงค้างมักเกิดจากลืมเสียบสายไฟเลี้ยงซีพียู 8-Pin EPS มุมซ้ายบนของเมนบอร์ด',
      faults: { cableCpu: false },
      explanation: 'นอกจากสาย 24-Pin ATX แล้ว เมนบอร์ดยุคใหม่ต้องเสียบสายไฟเลี้ยงซีพียู 8-Pin EPS (4+4 Pin) มุมบนซ้ายเสมอ มิฉะนั้นซีพียูจะไม่ได้รับไฟเลี้ยงและบูตไม่ผ่าน'
    },
    {
      id: 't7',
      num: 'CASE 07',
      title: 'อัปเกรดการ์ดจอ RTX 4090 แล้วไฟตัดดับทันที (PSU วัตต์ไม่พอ!)',
      difficulty: 'ท้าทาย',
      symptom: 'ลูกค้าถอด PSU 500W ตัวเก่าที่ตัดดับออกไปแล้ว และนำ PSU 1000W ตัวใหม่มาวางไว้ข้างโต๊ะซ่อม ให้คุณติดตั้ง PSU 1000W เสียบสายไฟให้ครบ และเปิดสวิตช์ทดสอบบูต!',
      clue: 'ติดตั้ง PSU 1000W ลงช่องล่างซ้าย ➔ เสียบสาย 24-Pin ATX + 8-Pin PCIe การ์ดจอ ➔ เปิดสวิตช์ PSU (ON)',
      customBuild: { mb: 'mb_b650', cpu: 'cpu_r9', cooler: 'cool_aio', ram: 'ram_32_d5', ssd: 'ssd_2tb', gpu: 'gpu_4090', psu: 'psu_1000' },
      faults: { psuMissing: true, cable24: false, cableGpu: false, psuSwitch: false },
      explanation: 'การ์ดจอระดับ RTX 4090 กินไฟสูงและมีไฟกระชาก (Transient Spikes) หากใช้ PSU วัตต์ต่ำเกินไป ระบบป้องกันไฟเกิน (OCP) จะตัดดับทันที ต้องใช้ PSU 850W–1000W และต่อสายให้ครบ'
    },
    {
      id: 't8',
      num: 'CASE 08',
      title: 'บอสใหญ่! เครื่องประกอบใหม่ 3 อาการซ้อน',
      difficulty: 'ยากพิเศษ',
      symptom: 'เครื่องลูกค้าประกอบแบบเร่งรีบจนมีจุดผิดพลาดหลายจุดพร้อมกัน! กดเปิดเครื่องแล้วเช็กอาการทีละขั้นจนกว่าเครื่องจะบูตเข้า Pixel OS สำเร็จ',
      clue: 'เช็กไล่ทีละสเต็ป: สวิตช์ PSU ➔ แรม (Beep สั้น 3) ➔ สายไฟเลี้ยงการ์ดจอ 8-Pin PCIe (Beep ยาว 1 สั้น 2)',
      faults: { psuSwitch: false, ramMissing: true, cableGpu: false },
      explanation: 'การซ่อมคอมพิวเตอร์จริงมักเจอปัญหาซ้อนกันหลายจุด การไล่เช็กตามลำดับ Power ➔ CPU ➔ RAM ➔ GPU ➔ Storage ช่วยปิดงานได้อย่างเป็นระบบ!'
    }
  ];

  // Mode 5: Encyclopedia (10 Topics)
  const ENCYCLOPEDIA = [
    {
      sprite: 'mb',
      title: 'เมนบอร์ด (Motherboard)',
      role: 'แผงวงจรหลัก — ศูนย์กลางเชื่อมต่ออุปกรณ์ทั้งหมด',
      body: 'เปรียบเสมือนระบบประสาทของคอมพิวเตอร์ มีซ็อกเก็ตสำหรับ CPU, สล็อต RAM, สล็อต PCIe สำหรับการ์ดจอ, สล็อต M.2 และพอร์ตจ่ายไฟต่างๆ',
      fact: 'ขนาดมาตรฐานยอดนิยมได้แก่ ATX (ใหญ่), Micro-ATX (กลาง) และ Mini-ITX (เล็กกะทัดรัด)',
      caution: 'ต้องขันหมุดรอง Standoffs ให้ตรงรูเมนบอร์ดเท่านั้น เพื่อป้องกันไฟฟ้าลัดวงจรด้านหลังแผงวงจร'
    },
    {
      sprite: 'cpu',
      title: 'ซีพียู (CPU - Central Processing Unit)',
      role: 'สมองหลัก — คำนวณและประมวลผลคำสั่งทั้งหมด',
      body: 'ทำหน้าที่ประมวลผลโปรแกรม เกม และระบบปฏิบัติการ ยิ่งมีจำนวนคอร์ (Cores) และความเร็วสัญญาณนาฬิกาสูง ยิ่งทำงานหนักได้เร็วขึ้น',
      fact: 'ต้องจับคู่ "Socket" ของ CPU ให้ตรงกับเมนบอร์ด เช่น LGA1700 หรือ AM5 ไม่สามารถใส่ข้ามซ็อกเก็ตได้',
      caution: 'ห้ามออกแรงกด CPU ลงซ็อกเก็ตเด็ดขาด ให้วางลงเบาๆ โดยเล็งสัญลักษณ์สามเหลี่ยมสีทองให้ตรงมุม'
    },
    {
      sprite: 'paste',
      title: 'ซิลิโคนระบายความร้อน (Thermal Paste)',
      role: 'ตัวกลางนำความร้อนจาก CPU ไปยังฮีตซิงก์',
      body: 'ผิวโลหะของ CPU และฐานฮีตซิงก์มีร่องขนาดจุลภาคที่มองไม่เห็น ซิลิโคนจะช่วยเติมเต็มช่องว่างอากาศเหล่านี้ให้ถ่ายเทความร้อนได้เต็มที่',
      fact: 'ปริมาณที่เหมาะสมที่สุดคือขนาดประมาณ "เม็ดถั่วเขียว" ตรงกลางกระดอง CPU เมื่อกดซิงก์ลงจะแผ่กระจายทั่วพอดี',
      caution: 'ถ้าทาบางเกินไปหรือลืมทา CPU จะร้อนจัดจนเครื่องดับ หากทาเยอะเกินไปจะล้นเลอะเทอะลงซ็อกเก็ต'
    },
    {
      sprite: 'cooler',
      title: 'ชุดระบายความร้อน (CPU Cooler)',
      role: 'พัดลมซิงก์ลม / ชุดน้ำปิด AIO ควบคุมอุณหภูมิ CPU',
      body: 'ดึงความร้อนออกจาก CPU แล้วระบายออกสู่อากาศ มีทั้งแบบ Stock Cooler, Tower Air Cooler ท่อทองแดง และชุดน้ำปิด Liquid AIO',
      fact: 'ควรเลือก Cooler ที่มีค่าการรับความร้อน (TDP Rating) สูงกว่าค่า TDP ของ CPU ที่เลือกใช้',
      caution: 'อย่าลืมลอกสติกเกอร์พลาสติกใสใต้ฐานทองแดง และเสียบสายไฟเข้าหัวต่อ CPU_FAN เสมอ'
    },
    {
      sprite: 'ram',
      title: 'แรม (RAM - Random Access Memory)',
      role: 'หน่วยความจำหลักชั่วคราว ความเร็วสูง',
      body: 'เก็บข้อมูลโปรแกรมที่กำลังเปิดใช้งานอยู่ เพื่อให้ CPU เรียกใช้ได้ทันที เมื่อปิดเครื่องข้อมูลในแรมจะหายไป',
      fact: 'การใส่แรม 2 แถวในสล็อต A2 และ B2 จะเปิดโหมด Dual Channel ช่วยเพิ่มแบนด์วิดท์รับส่งข้อมูลถึง 2 เท่า!',
      caution: 'DDR4 และ DDR5 มีร่องบากต่างกัน ใส่แทนกันไม่ได้ ต้องเลือกให้ตรงกับเมนบอร์ด'
    },
    {
      sprite: 'ssd',
      title: 'เอสเอสดี (M.2 NVMe SSD)',
      role: 'หน่วยเก็บข้อมูลถาวรความเร็วสูง',
      body: 'เก็บบันทึกระบบปฏิบัติการ โปรแกรม เกม และไฟล์งานอย่างถาวร แบบ M.2 NVMe เสียบตรงบนเมนบอร์ด เร็วกว่าฮาร์ดดิสก์จานหมุนกว่า 10–30 เท่า',
      fact: 'ไม่ต้องเดินสายไฟหรือสายข้อมูล SATA เพิ่ม ทำให้ภายในเคสโล่งและอากาศถ่ายเทดีขึ้น',
      caution: 'ต้องขันน็อตยึดปลายการ์ด M.2 ให้แน่น ไม่เช่นนั้นอาจหลุดหรือหน้าสัมผัสไม่แน่นจนบูตไม่เจอไดรฟ์'
    },
    {
      sprite: 'gpu',
      title: 'การ์ดจอ (GPU - Graphics Card)',
      role: 'หน่วยประมวลผลภาพกราฟิก 3D และ AI',
      body: 'ประมวลผลภาพส่งออกหน้าจอ มีหน่วยความจำ VRAM ในตัว สำคัญมากสำหรับเกมมิ่ง ตัดต่อวิดีโอ เรนเดอร์ 3D และงาน Deep Learning AI',
      fact: 'ติดตั้งลงในสล็อต PCIe x16 ช่องบนสุดใกล้ CPU ที่สุด เพื่อให้ได้รับแบนด์วิดท์เต็มที่ 16 เลน',
      caution: 'การ์ดจอส่วนใหญ่ต้องเสียบสายไฟเสริม PCIe 8-Pin จาก PSU และควรใช้ PSU กำลังวัตต์เพียงพอ'
    },
    {
      sprite: 'psu',
      title: 'พาวเวอร์ซัพพลาย (PSU)',
      role: 'แหล่งจ่ายพลังงานไฟฟ้าให้คอมพิวเตอร์ทั้งเครื่อง',
      body: 'แปลงไฟฟ้ากระแสสลับ (AC) จากปลั๊กไฟบ้านเป็นไฟฟ้ากระแสตรง (DC) แรงดัน 12V, 5V, 3.3V จ่ายให้ทุกชิ้นส่วนอย่างเสถียร',
      fact: 'มาตรฐาน 80 Plus (White / Bronze / Gold / Platinum) บอกถึงประสิทธิภาพการแปลงไฟที่ประหยัดและสูญเสียความร้อนน้อย',
      caution: 'ห้ามใช้สาย Modular ข้ามยี่ห้อ/ข้ามรุ่น และห้ามแกะฝา PSU เองเพราะอันตรายจากไฟฟ้าแรงสูง'
    },
    {
      sprite: 'fans',
      title: 'ทิศทางลมในเคส (Case Airflow)',
      role: 'ระบบหมุนเวียนอากาศร้อน-เย็นภายในเคส',
      body: 'พัดลมหน้าเคสทำหน้าที่ดูดลมเย็นเข้า (Intake) ผ่านอุปกรณ์ร้อนอย่าง GPU/CPU แล้วพัดลมหลังและบนเคสจะเป่าลมร้อนออก (Exhaust)',
      fact: 'หลักฟิสิกส์: อากาศร้อนลอยตัวสูงขึ้น จึงนิยมดูดลมเย็นเข้าด้านหน้า/ล่าง และเป่าลมร้อนออกด้านหลัง/บน',
      caution: 'หากติดพัดลมกลับด้านทั้งหมด จะทำให้ลมร้อนวนขังอยู่ในเคส ทำให้อุณหภูมิชิ้นส่วนสูงขึ้น'
    },
    {
      sprite: 'bios',
      title: 'การทดสอบ POST และหน้าจอ BIOS/UEFI',
      role: 'ระบบตรวจสอบฮาร์ดแวร์แรกสุดเมื่อกดเปิดเครื่อง',
      body: 'เมื่อกดปุ่ม Power เมนบอร์ดจะรัน POST (Power-On Self-Test) เช็ก CPU, RAM, GPU หากปกติจะดัง "ปี๊บ" สั้น 1 ครั้งแล้วเข้าสู่ BIOS/OS',
      fact: 'รหัสเสียง Beep Code ช่วยช่างวินิจฉัยอาการเสียได้ทันที เช่น สั้น 3 ครั้ง = แรมมีปัญหา, ยาว 1 สั้น 2 = การ์ดจอมีปัญหา',
      caution: 'สามารถใช้หน้า BIOS ตรวจอุณหภูมิ CPU, เช็ก Dual Channel RAM และลำดับการบูตได้ก่อนลงระบบปฏิบัติการ'
    }
  ];

  // Mode 5: 20 Educational Quiz Questions
  const QUIZ = [
    {
      q: '1. อุปกรณ์ใดเปรียบเสมือน "สมองของคอมพิวเตอร์" ที่ทำหน้าที่ประมวลผลคำสั่งหลัก?',
      opts: ['พาวเวอร์ซัพพลาย (PSU)', 'ซีพียู (CPU)', 'เอสเอสดี (SSD)', 'พัดลมเคส (Case Fan)'],
      ans: 1,
      exp: 'CPU (Central Processing Unit) ทำหน้าที่คำนวณและประมวลผลคำสั่งทั้งหมดของระบบคอมพิวเตอร์'
    },
    {
      q: '2. ก่อนติดตั้งเมนบอร์ดลงในเคส ต้องตรวจสอบว่ามีชิ้นส่วนใดรองใต้เมนบอร์ดเพื่อป้องกันไฟลัดวงจร?',
      opts: ['หมุดรองเมนบอร์ด (Standoffs)', 'สาย SATA', 'ซิลิโคนระบายความร้อน', 'ฝาปิดช่อง RAM'],
      ans: 0,
      exp: 'Standoffs ช่วยยกเมนบอร์ดให้ลอยเหนือแผ่นเหล็กเคส ป้องกันลายวงจรด้านหลังสัมผัสเหล็กจนเกิดไฟลัดวงจร'
    },
    {
      q: '3. ในการเลือกซื้อ CPU กับเมนบอร์ดให้ใช้งานร่วมกันได้ ต้องดูความเข้ากันได้ของค่าใดเป็นอันดับแรก?',
      opts: ['สีของแผงวงจร', 'ซ็อกเก็ต (Socket) เช่น LGA1700 หรือ AM5', 'ขนาดความจุ SSD', 'จำนวนพัดลมเคส'],
      ans: 1,
      exp: 'CPU และเมนบอร์ดต้องใช้ Socket เดียวกันเท่านั้นจึงจะติดตั้งและทำงานร่วมกันได้'
    },
    {
      q: '4. ปริมาณซิลิโคนระบายความร้อน (Thermal Paste) ที่เหมาะสมที่สุดบนกระดอง CPU คือขนาดใด?',
      opts: ['ไม่ต้องทาเลยก็ได้', 'บีบให้เต็มหลอดจนล้นขอบ', 'ประมาณเม็ดถั่วเขียวตรงกลาง CPU', 'ทาเฉพาะด้านใต้ขาเข็ม CPU'],
      ans: 2,
      exp: 'หยอดขนาดเม็ดถั่วเขียวตรงกลาง เมื่อกดฮีตซิงก์ลงจะแผ่กระจายคลุมหน้าสัมผัสได้พอดี ไม่น้อยหรือล้นเกินไป'
    },
    {
      q: '5. หากมีแรม 2 แถว บนเมนบอร์ดที่มี 4 สล็อต (A1, A2, B1, B2) ควรเสียบช่องใดเพื่อให้ทำงานแบบ Dual Channel?',
      opts: ['A1 และ A2 ติดกัน', 'A2 และ B2 (เว้นสล็อตสลับกัน)', 'ใส่แค่แถวเดียวก็พอ', 'B1 และ B2 ติดกัน'],
      ans: 1,
      exp: 'การใส่แรมช่อง A2 และ B2 (ตามคู่มือเมนบอร์ดส่วนใหญ่) จะเปิดโหมด Dual Channel เพิ่มแบนด์วิดท์รับส่งข้อมูล 2 เท่า'
    },
    {
      q: '6. แรมแบบ DDR4 สามารถนำมาเสียบลงบนเมนบอร์ดที่รองรับ DDR5 ได้หรือไม่?',
      opts: ['ได้ แต่ความเร็วลดลง', 'ได้ ถ้าใช้ค้อนตอกเบาๆ', 'ไม่ได้ เพราะร่องบากและแรงดันไฟต่างกัน', 'ได้เฉพาะคอมพิวเตอร์เล่นเกม'],
      ans: 2,
      exp: 'DDR4 และ DDR5 มีตำแหน่งร่องบาก (Notch) และสถาปัตยกรรมไฟฟ้าต่างกัน ไม่สามารถเสียบข้ามรุ่นได้'
    },
    {
      q: '7. ข้อใดคือหน้าที่หลักของพาวเวอร์ซัพพลาย (PSU)?',
      opts: ['เก็บไฟล์รูปภาพและวิดีโอ', 'แปลงไฟบ้าน AC เป็นไฟกระแสตรง DC จ่ายให้ชิ้นส่วนต่างๆ', 'ประมวลผลภาพกราฟิก 3D', 'เชื่อมต่ออินเทอร์เน็ต Wi-Fi'],
      ans: 1,
      exp: 'PSU ทำหน้าที่แปลงไฟกระแสสลับ AC จากไฟบ้าน เป็นไฟ DC แรงดันต่างๆ (12V/5V/3.3V) จ่ายให้อุปกรณ์คอมพิวเตอร์'
    },
    {
      q: '8. การ์ดจอแยก (GPU) ควรติดตั้งลงในสล็อตใดบนเมนบอร์ดเพื่อประสิทธิภาพสูงสุด?',
      opts: ['สล็อต M.2', 'สล็อต RAM', 'สล็อต PCIe x16 ช่องบนสุดใกล้ CPU', 'พอร์ต USB ด้านหน้าเคส'],
      ans: 2,
      exp: 'สล็อต PCIe x16 แถวบนสุดเชื่อมต่อตรงกับเลนของ CPU ให้แบนด์วิดท์เต็มความเร็ว'
    },
    {
      q: '9. สายไฟขนาดใหญ่ที่มีหัวต่อ 24 เข็ม (24-Pin ATX) ใช้เสียบเข้ากับอุปกรณ์ใด?',
      opts: ['การ์ดจอ (GPU)', 'พัดลมเคส', 'เมนบอร์ด (Motherboard)', 'M.2 NVMe SSD'],
      ans: 2,
      exp: 'สาย 24-Pin ATX คือสายจ่ายไฟหลักของเมนบอร์ด หากลืมเสียบเครื่องจะเปิดไม่ติด'
    },
    {
      q: '10. การจัดทิศทางลม (Airflow) ในเคสคอมพิวเตอร์ที่ถูกต้องตามหลักฟิสิกส์คือแบบใด?',
      opts: ['ดูดลมเย็นเข้าด้านหน้า → เป่าลมร้อนออกด้านหลังและด้านบน', 'เป่าลมออกทุกทิศทางโดยไม่ดูดเข้า', 'ดูดลมเข้าทุกทิศทางโดยไม่เป่าออก', 'ไม่จำเป็นต้องติดพัดลมเคส'],
      ans: 0,
      exp: 'อากาศเย็นถูกดูดเข้าด้านหน้าเพื่อเป่าผ่านชิ้นส่วน และอากาศร้อนซึ่งลอยตัวสูงขึ้นจะถูกระบายออกทางด้านหลังและด้านบน'
    },
    {
      q: '11. ขณะจับชิ้นส่วนอิเล็กทรอนิกส์ เช่น เมนบอร์ดหรือแรม ควรปฏิบัติอย่างไรเพื่อป้องกันไฟฟ้าสถิต (ESD)?',
      opts: ['ใส่ถุงเท้าเดินถูพรมก่อนจับ', 'จับบริเวณขอบแผงวงจรและแตะโลหะเคสเพื่อคายประจุก่อน', 'ล้างแผงวงจรด้วยน้ำสบู่', 'ใช้นิ้วกดตรงหน้าสัมผัสสีทองแรงๆ'],
      ans: 1,
      exp: 'ไฟฟ้าสถิต (ESD) สามารถทำลายชิปอิเล็กทรอนิกส์ได้ ควรคายประจุโดยแตะโครงโลหะและจับที่ขอบแผงวงจรเสมอ'
    },
    {
      q: '12. เมื่อกดเปิดเครื่องแล้วจอมืด พร้อมมีเสียง POST Beep สั้นๆ 3 ครั้ง มักเกิดจากสาเหตุใด?',
      opts: ['ลืมเสียบเมาส์', 'แรมเสียบไม่แน่นหรือตรวจไม่พบแรม', 'เมาส์แบตหมด', 'ฝาเคสไม่ได้ปิด'],
      ans: 1,
      exp: 'เสียง Beep สั้น 3 ครั้ง เป็นรหัสอาการเสียมาตรฐานของหน่วยความจำ (RAM) ให้ลองถอดเช็ดหน้าสัมผัสแล้วเสียบใหม่ให้ดังคลิก'
    },
    {
      q: '13. หากประกอบเครื่องเสร็จแล้วเปิดเครื่องได้สักพัก CPU ร้อนถึง 98°C แล้วเครื่องดับเอง ควรตรวจเช็กสิ่งใดก่อน?',
      opts: ['สีของไฟ RGB', 'ลืมทาซิลิโคน / ลืมลอกพลาสติกฐานซิงก์ / ลืมเสียบสาย CPU_FAN', 'ขนาดของจอภาพ', 'ความจุของ SSD'],
      ans: 1,
      exp: 'ปัญหาความร้อน CPU พุ่งสูงผิดปกติเกือบทั้งหมดเกิดจากการติดตั้ง Cooler ไม่แนบ ลืมทาซิลิโคน หรือพัดลม CPU ไม่หมุน'
    },
    {
      q: '14. อุปกรณ์ใดที่ "ไม่ต้อง" เดินสายไฟจาก PSU มาเสียบโดยตรง เพราะรับไฟผ่านสล็อตบนเมนบอร์ดอยู่แล้ว?',
      opts: ['เมนบอร์ด (24-Pin)', 'การ์ดจอ RTX 4090', 'M.2 NVMe SSD และ RAM', 'ซีพียู (8-Pin EPS)'],
      ans: 2,
      exp: 'M.2 NVMe SSD และ RAM รับพลังงานไฟฟ้าผ่านสล็อตบนเมนบอร์ดโดยตรง ไม่ต้องเสียบสายไฟจาก PSU'
    },
    {
      q: '15. หากคอมพิวเตอร์ใช้ไฟรวมขณะโหลดสูงสุดประมาณ 550W ควรเลือก PSU ขนาดกี่วัตต์จึงจะปลอดภัยและเสถียร?',
      opts: ['400W', '500W', '750W ขึ้นไป (เผื่อกำลังไฟสำรอง 20–30%)', '250W'],
      ans: 2,
      exp: 'ควรเลือก PSU ที่มีกำลังไฟเผื่อจากโหลดรวมอย่างน้อย 20–30% เพื่อให้จ่ายไฟนิ่ง ประหยัดไฟสูงสุด และรองรับไฟกระชาก (Transient Spikes)'
    },
    {
      q: '16. ความแตกต่างสำคัญของซ็อกเก็ต AM4 กับ AM5 ที่ต้องระวังขณะติดตั้งซีพียูคือข้อใด?',
      opts: ['AM4 เข็มอยู่บนตัว CPU (PGA) ส่วน AM5 เข็มอยู่ในซ็อกเก็ตเมนบอร์ด (LGA)', 'AM4 ใช้ได้กับแรม DDR5 เท่านั้น', 'AM5 ใช้ซิลิโคนไม่ได้', 'ไม่มีความต่าง สามารถใส่ CPU ข้ามกันได้'],
      ans: 0,
      exp: 'AM4 ใช้แพ็กเกจ PGA (ขาเข็มอยู่ใต้ CPU) ส่วน AM5 เปลี่ยนเป็น LGA (เข็มอยู่ในซ็อกเก็ตบนเมนบอร์ด) และใช้ร่วมกับแรม DDR5 เท่านั้น'
    },
    {
      q: '17. เหตุใดจึงห้ามนำสายไฟ 8-Pin PCIe (สำหรับการ์ดจอ) ไปเสียบเข้าช่อง 8-Pin EPS (สำหรับ CPU) บนเมนบอร์ด?',
      opts: ['สีของสายไม่สวย', 'การเรียงขั้วไฟ +12V และกราวด์ (GND) ต่างกัน อาจทำให้ลัดวงจรเสียหายได้', 'ความยาวสายสั้นเกินไป', 'จะทำให้ความเร็วอินเทอร์เน็ตช้าลง'],
      ans: 1,
      exp: 'ขั้ว 8-Pin CPU (4+4 Pin) และ 8-Pin PCIe (6+2 Pin) มีการจัดเรียงขั้ว +12V และ GND สลับกัน หากฝืนเสียบผิดช่องอาจเกิดการลัดวงจรได้'
    },
    {
      q: '18. ข้อใดกล่าวถูกต้องเกี่ยวกับหน่วยความจำ RAM และ SSD?',
      opts: ['RAM เก็บข้อมูลถาวรแม้ปิดเครื่อง ส่วน SSD ข้อมูลหายเมื่อปิดเครื่อง', 'RAM เก็บข้อมูลชั่วคราวความเร็วสูง (ข้อมูลหายเมื่อดับไฟ) ส่วน SSD เก็บข้อมูลถาวร', 'ทั้งคู่เก็บข้อมูลเหมือนกันทุกประการ', 'SSD เสียบลงสล็อตเดียวกับ RAM'],
      ans: 1,
      exp: 'RAM เป็นหน่วยความจำชั่วคราว (Volatile) ข้อมูลจะหายเมื่อไม่มีไฟเลี้ยง ส่วน SSD เป็นหน่วยความจำถาวร (Non-Volatile) สำหรับเก็บ OS และไฟล์'
    },
    {
      q: '19. หากคอมพิวเตอร์เล่นเกมหนักแล้วดับวูบกะทันหันทันทีที่การ์ดจอดึงไฟสูง มักเกิดจากระบบป้องกันใดของ PSU?',
      opts: ['XMP Profile', 'OCP / OPP (Over Current / Power Protection) เนื่องจากวัตต์ PSU ไม่พอ', 'Dual Channel Mode', 'Secure Boot'],
      ans: 1,
      exp: 'เมื่อการ์ดจอดึงไฟกระชากเกินขีดจำกัดของ PSU ระบบป้องกัน OCP/OPP จะตัดไฟทันทีเพื่อป้องกันอุปกรณ์เสียหาย'
    },
    {
      q: '20. ขั้นตอนแรกที่ปลอดภัยที่สุดก่อนเปิดฝาเคสเพื่อซ่อมแซมหรืออัปเกรดชิ้นส่วนภายในคือข้อใด?',
      opts: ['เปิดเครื่องค้างไว้เพื่อดูไฟ', 'ปิดสวิตช์ PSU, ถอดปลั๊กไฟบ้านออก และแตะโครงโลหะเพื่อคายประจุไฟฟ้าสถิต', 'ใช้น้ำเช็ดทำความสะอาดเมนบอร์ด', 'กดปุ่ม Reset รัวๆ'],
      ans: 1,
      exp: 'ควรตัดกระแสไฟทั้งปิดสวิตช์ PSU และถอดปลั๊กไฟออกให้สนิท จากนั้นคายประจุไฟฟ้าสถิต (ESD) ก่อนสัมผัสแผงวงจรทุกครั้ง'
    }
  ];

  // Achievements / Badges
  const ACHIEVEMENTS = [
    { id: 'tut_done', icon: '🎓', title: 'บัณฑิตฝึกหัด', desc: 'ผ่านโหมดฝึกสอน 12 ขั้นตอนสำเร็จ' },
    { id: 'perfect_paste', icon: '🧪', title: 'จอมยุทธ์ซิลิโคน', desc: 'ทาซิลิโคนขนาดเม็ดถั่วเขียวพอดีเป๊ะ!' },
    { id: 'speed_builder', icon: '⚡', title: 'ช่างประกอบสายฟ้า', desc: 'ผ่านโหมดทดสอบได้เกรด A หรือ S' },
    { id: 'mission_1', icon: '💼', title: 'นักจัดสเปกมือใหม่', desc: 'ผ่านภารกิจจัดสเปกอย่างน้อย 1 ภารกิจ' },
    { id: 'mission_all', icon: '👑', title: 'ปรมาจารย์จัดสเปก', desc: 'พิชิตภารกิจจัดสเปกครบทั้ง 8 โจทย์' },
    { id: 'repair_1', icon: '🔧', title: 'ช่างซ่อมรุ่นเยาว์', desc: 'ซ่อมคอมพิวเตอร์ในศูนย์ซ่อมสำเร็จ 1 เคส' },
    { id: 'repair_all', icon: '🩺', title: 'หมอคอมมือทอง', desc: 'วินิจฉัยและซ่อมสำเร็จครบทั้ง 8 เคส' },
    { id: 'quiz_pass', icon: '📝', title: 'รอบรู้ฮาร์ดแวร์', desc: 'ทำแบบทดสอบได้คะแนน 15/20 ขึ้นไป' },
    { id: 'quiz_perfect', icon: '🌟', title: 'อัจฉริยะ 20/20', desc: 'ทำแบบทดสอบได้เต็ม 20 คะแนน!' },
    { id: 'bios_boot', icon: '🖥️', title: 'POST Beep แรก!', desc: 'ทดสอบเปิดเครื่องบูตเข้า BIOS สำเร็จ' },
    { id: 'hard_clear', icon: '🔥', title: 'ช่างคอมระดับฮาร์ดคอร์', desc: 'ประกอบหรือซ่อมเครื่องผ่านในระดับความยาก HARD' },
    { id: 'cert_export', icon: '📜', title: 'นักเรียนดีเด่นประจำห้อง', desc: 'ลงทะเบียนชื่อผู้เรียนและออกรายงานคะแนน/เกียรติบัตร' }
  ];

  return {
    CATALOG,
    DEFAULT_BUILD,
    DIFFICULTIES,
    STEPS,
    MISSIONS,
    TROUBLESHOOT_CASES,
    ENCYCLOPEDIA,
    QUIZ,
    ACHIEVEMENTS,
    getPartById
  };
})();
