// 价格配置数据
const priceConfig = {
    // 发动机系列
    engine: {
        brand: {
            cummins: 50000,
            caterpillar: 60000,
            volvo: 55000,
            yuchai: 45000
        },
        emission: {
            tier1: 0,
            tier2: 0,
            tier3: 0,
            tier4: 0
        },
        power: {
            100: 100000,
            200: 200000,
            300: 280000,
            400: 350000,
            500: 420000
        }
    },
    
    // 水箱系列
    radiator: {
        type: {
            aluminum: 15000,
            copper: 20000
        },
        temp: {
            low: 0,
            medium: 3000,
            high: 6000
        }
    },
    
    // 发电机系列
    generator: {
        brand: {
            stamford: 40000,
            mecc: 38000,
            leroy: 42000,
            siemens: 45000
        },
        output: {
            "three-phase": 10000,
            "single-phase": 8000
        },
        capacity: {
            100: 80000,
            200: 150000,
            300: 220000,
            400: 280000
        }
    },
    
    // 底盘系列
    chassis: {
        type: {
            tank: 12000,
            open: 8000
        }
    },
    
    // 控制器系列
    controller: {
        brand: {
            deepsea: 8000,
            comap: 10000,
            deif: 12000,
            zhongzhi: 9000
        },
        model: {
            7320: 5000,
            8610: 8000,
            6020: 6000
        }
    },
    
    // 电气系统
    electrical: {
        brand: {
            schneider: 15000,
            abb: 14000,
            siemens: 16000
        },
        model: {
            masterpact: 20000,
            tmax: 18000,
            sivacon: 22000
        }
    },
    
    // 机械系统
    mechanical: {
        type: {
            integrated: 10000,
            split: 8000
        }
    },
    
    // 可选配置项
    options: {
        silencer: 5000,
        heater: 8000,
        container: 12000
    }
};

// 当前配置
let currentConfig = {
    engine: { emission: "", brand: "", rpm: "", power: "" },
    radiator: { type: "copper", temp: "high" },
    generator: { brand: "stamford", output: "three-phase", capacity: "200" },
    chassis: { type: "tank" },
    controller: { brand: "zhongzhi", model: "7320" },
    electrical: { brand: "schneider", model: "masterpact" },
    mechanical: { type: "integrated" },
    options: { 
        silencer: true, 
        heater: false,
        container: true
    },
    taxRate: 0.13
};

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有选择框
    initSelect('engine-emission', currentConfig.engine.emission);
    initSelect('engine-brand', currentConfig.engine.brand);
    initSelect('engine-rpm', currentConfig.engine.rpm);
    initSelect('engine-power', currentConfig.engine.power);
    initSelect('radiator-type', currentConfig.radiator.type);
    initSelect('radiator-temp', currentConfig.radiator.temp);
    initSelect('generator-brand', currentConfig.generator.brand);
    initSelect('generator-output', currentConfig.generator.output);
    initSelect('generator-capacity', currentConfig.generator.capacity);
    initSelect('chassis-type', currentConfig.chassis.type);
    initSelect('controller-brand', currentConfig.controller.brand);
    initSelect('controller-model', currentConfig.controller.model);
    initSelect('electrical-brand', currentConfig.electrical.brand);
    initSelect('electrical-model', currentConfig.electrical.model);
    initSelect('mechanical-type', currentConfig.mechanical.type);
    
    // 初始化复选框
    document.getElementById('option1').checked = currentConfig.options.silencer;
    document.getElementById('option2').checked = currentConfig.options.heater;
    document.getElementById('option3').checked = currentConfig.options.container;
    
    // 初始化税率
    document.getElementById('tax13').checked = true;
    
    // 添加事件监听
    addEventListeners();
    
    // 首次计算价格
    updatePriceDisplay();
});

// 初始化选择框
function initSelect(id, value) {
    const select = document.getElementById(id);
    if (select) {
        select.value = value;
    }
}

// 更新价格显示
function updatePriceDisplay() {
    // 计算各部分价格
    let enginePrice = calculateEnginePrice();
    let radiatorPrice = calculateRadiatorPrice();
    let generatorPrice = calculateGeneratorPrice();
    let chassisPrice = calculateChassisPrice();
    let controllerPrice = calculateControllerPrice();
    let electricalPrice = calculateElectricalPrice();
    let mechanicalPrice = calculateMechanicalPrice();
    let optionsPrice = calculateOptionsPrice();
    
    // 计算小计
    let subtotal = enginePrice + radiatorPrice + generatorPrice + 
                   chassisPrice + controllerPrice + electricalPrice + 
                   mechanicalPrice + optionsPrice;
    
    // 获取税率
    let taxRate = currentConfig.taxRate;
    let taxAmount = subtotal * taxRate;
    let totalPrice = subtotal + taxAmount;
    
    // 更新价格显示
    document.getElementById('total-price').textContent = '¥ ' + formatNumber(totalPrice);
    document.getElementById('base-price').textContent = '基础价格: ¥ ' + formatNumber(subtotal);
    document.getElementById('tax-note').textContent = '(含增值税 ' + (taxRate * 100) + '%)';
    
    // 更新价格明细
    updateDetailRow('发动机系列', enginePrice, 
        `${getSelectedText('engine-brand')} ${getSelectedText('engine-emission')} ${getSelectedText('engine-power')}`);
    
    updateDetailRow('水箱系列', radiatorPrice, 
        `${getSelectedText('radiator-type')} (${getSelectedText('radiator-temp')})`);
    
    updateDetailRow('发电机系列', generatorPrice, 
        `${getSelectedText('generator-brand')} ${getSelectedText('generator-output')} ${getSelectedText('generator-capacity')}`);
    
    updateDetailRow('底盘系列', chassisPrice, 
        getSelectedText('chassis-type'));
    
    updateDetailRow('控制器系列', controllerPrice, 
        `${getSelectedText('controller-brand')} ${getSelectedText('controller-model')}`);
    
    updateDetailRow('电气系统', electricalPrice, 
        `${getSelectedText('electrical-brand')} ${getSelectedText('electrical-model')}`);
    
    updateDetailRow('机械系统', mechanicalPrice, 
        getSelectedText('mechanical-type'));
    
    // 更新可选配置项描述
    let optionsText = [];
    if (currentConfig.options.silencer) optionsText.push("消音器");
    if (currentConfig.options.heater) optionsText.push("冷却液加热器");
    if (currentConfig.options.container) optionsText.push("防雨集装箱");
    if (optionsText.length === 0) optionsText.push("无");
    
    updateDetailRow('可选配置项', optionsPrice, optionsText.join(', '));
    
    // 更新小计和总计
    document.getElementById('subtotal-price').parentNode.nextElementSibling.children[1].textContent = '¥ ' + formatNumber(subtotal);
    document.getElementById('tax-amount').textContent = '¥ ' + formatNumber(taxAmount) + ' (' + (taxRate * 100) + '%)';
    document.getElementById('final-price').textContent = '¥ ' + formatNumber(totalPrice);
    
    // 显示通知
    showNotification();
}

// 更新表格行
function updateDetailRow(title, price, description) {
    const rows = document.querySelectorAll('.price-table tr');
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('td');
        if (cells[0].textContent.startsWith(title)) {
            cells[0].innerHTML = `${title} - ${description}`;
            cells[1].textContent = '¥ ' + formatNumber(price);
            break;
        }
    }
}

// 获取选择框的文本
function getSelectedText(id) {
    const select = document.getElementById(id);
    return select.options[select.selectedIndex].text;
}

// 显示通知
function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// 格式化数字显示
function formatNumber(num) {
    return num.toLocaleString();
}

// 计算发动机价格
function calculateEnginePrice() {
    if (!currentConfig.engine.brand || !currentConfig.engine.emission || !currentConfig.engine.power) 
        return 0;
    
    const brandPrice = priceConfig.engine.brand[currentConfig.engine.brand] || 0;
    const emissionPrice = priceConfig.engine.emission[currentConfig.engine.emission] || 0;
    const powerPrice = priceConfig.engine.power[currentConfig.engine.power] || 0;
    
    return brandPrice + emissionPrice + powerPrice;
}

// 计算水箱价格
function calculateRadiatorPrice() {
    if (!currentConfig.radiator.type || !currentConfig.radiator.temp) 
        return 0;
    
    const typePrice = priceConfig.radiator.type[currentConfig.radiator.type] || 0;
    const tempPrice = priceConfig.radiator.temp[currentConfig.radiator.temp] || 0;
    
    return typePrice + tempPrice;
}

// 计算发电机价格
function calculateGeneratorPrice() {
    if (!currentConfig.generator.brand || !currentConfig.generator.output || !currentConfig.generator.capacity) 
        return 0;
    
    const brandPrice = priceConfig.generator.brand[currentConfig.generator.brand] || 0;
    const outputPrice = priceConfig.generator.output[currentConfig.generator.output] || 0;
    const capacityPrice = priceConfig.generator.capacity[currentConfig.generator.capacity] || 0;
    
    return brandPrice + outputPrice + capacityPrice;
}

// 计算底盘价格
function calculateChassisPrice() {
    if (!currentConfig.chassis.type) 
        return 0;
    
    return priceConfig.chassis.type[currentConfig.chassis.type] || 0;
}

// 计算控制器价格
function calculateControllerPrice() {
    if (!currentConfig.controller.brand || !currentConfig.controller.model) 
        return 0;
    
    const brandPrice = priceConfig.controller.brand[currentConfig.controller.brand] || 0;
    const modelPrice = priceConfig.controller.model[currentConfig.controller.model] || 0;
    
    return brandPrice + modelPrice;
}

// 计算电气系统价格
function calculateElectricalPrice() {
    if (!currentConfig.electrical.brand || !currentConfig.electrical.model) 
        return 0;
    
    const brandPrice = priceConfig.electrical.brand[currentConfig.electrical.brand] || 0;
    const modelPrice = priceConfig.electrical.model[currentConfig.electrical.model] || 0;
    
    return brandPrice + modelPrice;
}

// 计算机械系统价格
function calculateMechanicalPrice() {
    if (!currentConfig.mechanical.type) 
        return 0;
    
    return priceConfig.mechanical.type[currentConfig.mechanical.type] || 0;
}

// 计算可选配置项价格
function calculateOptionsPrice() {
    let price = 0;
    
    if (currentConfig.options.silencer) price += priceConfig.options.silencer;
    if (currentConfig.options.heater) price += priceConfig.options.heater;
    if (currentConfig.options.container) price += priceConfig.options.container;
    
    return price;
}

// 计算小计
function calculateSubtotal() {
    return calculateEnginePrice() + 
           calculateRadiatorPrice() + 
           calculateGeneratorPrice() + 
           calculateChassisPrice() + 
           calculateControllerPrice() + 
           calculateElectricalPrice() + 
           calculateMechanicalPrice() + 
           calculateOptionsPrice();
}

// 添加事件监听器
function addEventListeners() {
    // 发动机系列
    document.getElementById('engine-brand').addEventListener('change', function(e) {
        currentConfig.engine.brand = e.target.value;
        updatePriceDisplay();
    });
    
    document.getElementById('engine-emission').addEventListener('change', function(e) {
        currentConfig.engine.emission = e.target.value;
        updatePriceDisplay();
    });
    
    document.getElementById('engine-power').addEventListener('change', function(e) {
        currentConfig.engine.power = e.target.value;
        updatePriceDisplay();
    });
    
    // 水箱系列
    document.getElementById('radiator-type').addEventListener('change', function(e) {
        currentConfig.radiator.type = e.target.value;
        updatePriceDisplay();
    });
    
    document.getElementById('radiator-temp').addEventListener('change', function(e) {
        currentConfig.radiator.temp = e.target.value;
        updatePriceDisplay();
    });
    
    // 发电机系列
    document.getElementById('generator-brand').addEventListener('change', function(e) {
        currentConfig.generator.brand = e.target.value;
        updatePriceDisplay();
    });
    
    document.getElementById('generator-output').addEventListener('change', function(e) {
        currentConfig.generator.output = e.target.value;
        updatePriceDisplay();
    });
    
    document.getElementById('generator-capacity').addEventListener('change', function(e) {
        currentConfig.generator.capacity = e.target.value;
        updatePriceDisplay();
    });
    
    // 底盘系列
    document.getElementById('chassis-type').addEventListener('change', function(e) {
        currentConfig.chassis.type = e.target.value;
        updatePriceDisplay();
    });
    
    // 控制器系列
    document.getElementById('controller-brand').addEventListener('change', function(e) {
        currentConfig.controller.brand = e.target.value;
        updatePriceDisplay();
    });
    
    document.getElementById('controller-model').addEventListener('change', function(e) {
        currentConfig.controller.model = e.target.value;
        updatePriceDisplay();
    });
    
    // 电气系统
    document.getElementById('electrical-brand').addEventListener('change', function(e) {
        currentConfig.electrical.brand = e.target.value;
        updatePriceDisplay();
    });
    
    document.getElementById('electrical-model').addEventListener('change', function(e) {
        currentConfig.electrical.model = e.target.value;
        updatePriceDisplay();
    });
    
    // 机械系统
    document.getElementById('mechanical-type').addEventListener('change', function(e) {
        currentConfig.mechanical.type = e.target.value;
        updatePriceDisplay();
    });
    
    // 可选配置项
    document.getElementById('option1').addEventListener('change', function(e) {
        currentConfig.options.silencer = e.target.checked;
        updatePriceDisplay();
    });
    
    document.getElementById('option2').addEventListener('change', function(e) {
        currentConfig.options.heater = e.target.checked;
        updatePriceDisplay();
    });
    
    document.getElementById('option3').addEventListener('change', function(e) {
        currentConfig.options.container = e.target.checked;
        updatePriceDisplay();
    });
    
    // 税率
    document.getElementById('tax0').addEventListener('change', function(e) {
        if (e.target.checked) {
            currentConfig.taxRate = 0;
            updatePriceDisplay();
        }
    });
    
    document.getElementById('tax13').addEventListener('change', function(e) {
        if (e.target.checked) {
            currentConfig.taxRate = 0.13;
            updatePriceDisplay();
        }
    });
    
    // 按钮事件
    document.getElementById('submit-config').addEventListener('click', function() {
        alert('配置已成功提交！我们的销售人员会尽快与您联系。');
    });

    // PDF导出
    document.getElementById('export-pdf').addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // 添加标题
        doc.setFontSize(20);
        doc.text('发电机组配置报价单', 105, 20, null, null, 'center');
        
        // 添加公司信息
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('专业发电机组供应商', 105, 30, null, null, 'center');
        doc.text('电话: 400-123-4567 | 邮箱: info@power-generator.com', 105, 35, null, null, 'center');
        
        doc.setLineWidth(0.5);
        doc.line(15, 40, 195, 40);
        
        // 添加配置信息
        doc.setFontSize(12);
        doc.setTextColor(0);
        let yPos = 50;
        
        // 配置项目
        const configItems = [
            [`发动机品牌`, `${getSelectedText('engine-brand')}`],
            [`排放标准`, `${getSelectedText('engine-emission')}`],
            [`型号功率`, `${getSelectedText('engine-power')}`],
            [`水箱类型`, `${getSelectedText('radiator-type')} - ${getSelectedText('radiator-temp')}`],
            [`发电机品牌`, `${getSelectedText('generator-brand')}`],
            [`输出类型`, `${getSelectedText('generator-output')}`],
            [`容量`, `${getSelectedText('generator-capacity')}`],
            [`底盘类型`, `${getSelectedText('chassis-type')}`],
            [`控制器品牌`, `${getSelectedText('controller-brand')} ${getSelectedText('controller-model')}`],
            [`电气系统`, `${getSelectedText('electrical-brand')} ${getSelectedText('electrical-model')}`],
            [`机械系统`, `${getSelectedText('mechanical-type')}`],
            [`税率`, `${currentConfig.taxRate * 100}%`]
        ];
        
        configItems.forEach((item, index) => {
            doc.text(item[0] + ':', 20, yPos + index * 7);
            doc.text(item[1], 80, yPos + index * 7);
        });
        
        // 添加价格信息
        yPos += 85;
        doc.setLineWidth(0.5);
        doc.line(15, yPos, 195, yPos);
        
        const subtotal = calculateSubtotal();
        const taxAmount = subtotal * currentConfig.taxRate;
        const totalPrice = subtotal + taxAmount;
        
        // 价格表格
        doc.setFontSize(12);
        doc.text('价格明细', 105, yPos + 10, null, null, 'center');
        
        // 设置表格位置
        yPos += 20;
        
        // 表头
        doc.setFillColor(52, 152, 219);
        doc.setTextColor(255, 255, 255);
        doc.rect(15, yPos, 180, 8, 'F');
        doc.text('项目', 25, yPos + 5);
        doc.text('价格', 170, yPos + 5, null, null, 'right');
        
        yPos += 10;
        
        // 表格行
        doc.setTextColor(0);
        
        let rows = [
            [`发动机系列`, calculateEnginePrice()],
            [`水箱系列`, calculateRadiatorPrice()],
            [`发电机系列`, calculateGeneratorPrice()],
            [`底盘系列`, calculateChassisPrice()],
            [`控制器系列`, calculateControllerPrice()],
            [`电气系统`, calculateElectricalPrice()],
            [`机械系统`, calculateMechanicalPrice()],
            [`可选配置项`, calculateOptionsPrice()],
            [`小计`, subtotal],
            [`增值税 (${currentConfig.taxRate * 100}%)`, taxAmount],
            [`总计`, totalPrice]
        ];
        
        rows.forEach((row, index) => {
            // 每10像素一行
            const rowY = yPos + index * 8;
            
            if (index === rows.length - 3) {
                doc.setFillColor(227, 242, 253);
                doc.rect(15, rowY, 180, 8, 'F');
            }
            else if (index === rows.length - 2) {
                doc.setFillColor(255, 236, 179);
                doc.rect(15, rowY, 180, 8, 'F');
            }
            else if (index === rows.length - 1) {
                doc.setFillColor(187, 222, 251);
                doc.rect(15, rowY, 180, 8, 'F');
            }
            
            doc.text(row[0], 20, rowY + 5);
            doc.text('¥ ' + formatNumber(row[1]), 180, rowY + 5, null, null, 'right');
        });
        
        // 保存PDF
        doc.save('发电机组配置报价单.pdf');
        
        // 显示通知
        const notification = document.getElementById('notification');
        notification.innerHTML = '<i class="fas fa-check-circle"></i> 报价单已导出为PDF!';
        notification.style.background = '#3498db';
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    });
}

// 计算小计
function calculateSubtotal() {
    return calculateEnginePrice() + 
           calculateRadiatorPrice() + 
           calculateGeneratorPrice() + 
           calculateChassisPrice() + 
           calculateControllerPrice() + 
           calculateElectricalPrice() + 
           calculateMechanicalPrice() + 
           calculateOptionsPrice();
}